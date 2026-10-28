from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import User, Resume, JobAnalysis
from backend.app.schemas import JobAnalysisRequest, JobAnalysisResponse
from backend.app.security.dependencies import get_current_user
from backend.app.services.ats_analyzer import analyze_ats

router = APIRouter(prefix="/analysis", tags=["AI Job Analysis"])


@router.post("", response_model=JobAnalysisResponse, status_code=status.HTTP_201_CREATED)
def run_job_analysis(
    req: JobAnalysisRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume_text = req.resume_text or ""
    resume_skills = []

    if req.resume_id:
        resume = db.query(Resume).filter(
            Resume.id == req.resume_id,
            Resume.user_id == current_user.id
        ).first()
        if resume:
            resume_text = f"{resume.summary} {resume.role_title} {resume.raw_text}"
            resume_skills = resume.skills or []

    if not resume_text:
        # Check if user has a primary resume
        primary = db.query(Resume).filter(
            Resume.user_id == current_user.id,
            Resume.is_primary == True
        ).first()
        if primary:
            resume_text = f"{primary.summary} {primary.role_title} {primary.raw_text}"
            resume_skills = primary.skills or []

    result = analyze_ats(
        resume_text=resume_text,
        job_description=req.job_description,
        resume_skills=resume_skills
    )

    analysis_record = JobAnalysis(
        user_id=current_user.id,
        resume_id=req.resume_id,
        target_role=req.target_role,
        company=req.company or "",
        job_description=req.job_description,
        match_score=result["match_score"],
        breakdown=result["breakdown"],
        missing_keywords=result["missing_keywords"],
        matched_keywords=result["matched_keywords"],
        recommendations=result["recommendations"],
    )
    db.add(analysis_record)
    db.commit()
    db.refresh(analysis_record)
    return analysis_record


@router.get("", response_model=List[JobAnalysisResponse])
def list_analyses(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(JobAnalysis).filter(
        JobAnalysis.user_id == current_user.id
    ).order_by(JobAnalysis.created_at.desc()).all()
