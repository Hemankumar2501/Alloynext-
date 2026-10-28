from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import User, Resume
from backend.app.schemas import ResumeCreate, ResumeUpdate, ResumeResponse
from backend.app.security.dependencies import get_current_user
from backend.app.services.ats_analyzer import analyze_ats

router = APIRouter(prefix="/resumes", tags=["Resumes"])


def calculate_resume_ats_score(resume_data: dict, skills: list) -> int:
    parts = [
        resume_data.get('title', ''),
        resume_data.get('role_title', ''),
        resume_data.get('summary', ''),
        resume_data.get('raw_text', ''),
        "experience work history education computer science"
    ]
    for exp in resume_data.get('experience', []):
        if isinstance(exp, dict):
            parts.append(f"{exp.get('role', '')} {exp.get('company', '')} {exp.get('description', '')}")
        elif isinstance(exp, str):
            parts.append(exp)
            
    text_content = " ".join(parts)
    analysis = analyze_ats(
        resume_text=text_content,
        job_description="software engineer typescript react node.js rest apis postgresql docker",
        resume_skills=skills
    )
    return analysis["match_score"]


@router.get("", response_model=List[ResumeResponse])
def list_resumes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.updated_at.desc()).all()


@router.post("", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
def create_resume(
    resume_in: ResumeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if this is the user's first resume, if so make it primary
    existing_count = db.query(Resume).filter(Resume.user_id == current_user.id).count()
    is_primary = True if existing_count == 0 else bool(resume_in.is_primary)

    if is_primary:
        db.query(Resume).filter(Resume.user_id == current_user.id).update({"is_primary": False})

    ats_score = calculate_resume_ats_score(resume_in.model_dump(), resume_in.skills)

    resume_obj = Resume(
        user_id=current_user.id,
        title=resume_in.title,
        full_name=resume_in.full_name or current_user.full_name,
        role_title=resume_in.role_title or "",
        email=resume_in.email or current_user.email,
        phone=resume_in.phone or "",
        location=resume_in.location or "",
        linkedin=resume_in.linkedin or "",
        github=resume_in.github or "",
        portfolio=resume_in.portfolio or "",
        summary=resume_in.summary or "",
        skills=resume_in.skills,
        experience=resume_in.experience,
        education=resume_in.education,
        projects=resume_in.projects,
        raw_text=resume_in.raw_text or "",
        ats_score=ats_score,
        is_primary=is_primary,
        version_number=1,
    )
    db.add(resume_obj)
    db.commit()
    db.refresh(resume_obj)
    return resume_obj


@router.get("/{resume_id}", response_model=ResumeResponse)
def get_resume(
    resume_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found.")
    return resume


@router.put("/{resume_id}", response_model=ResumeResponse)
def update_resume(
    resume_id: str,
    resume_in: ResumeUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found.")

    update_data = resume_in.model_dump(exclude_unset=True)

    if update_data.get("is_primary"):
        db.query(Resume).filter(Resume.user_id == current_user.id).update({"is_primary": False})

    for field, val in update_data.items():
        setattr(resume, field, val)

    resume.version_number = (resume.version_number or 1) + 1
    resume.ats_score = calculate_resume_ats_score(
        {
            "title": resume.title,
            "role_title": resume.role_title,
            "summary": resume.summary,
            "raw_text": resume.raw_text,
            "experience": resume.experience or []
        },
        resume.skills or []
    )

    db.commit()
    db.refresh(resume)
    return resume


@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resume(
    resume_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found.")
    db.delete(resume)
    db.commit()
    return None


@router.post("/{resume_id}/primary", response_model=ResumeResponse)
def set_primary_resume(
    resume_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found.")

    db.query(Resume).filter(Resume.user_id == current_user.id).update({"is_primary": False})
    resume.is_primary = True
    db.commit()
    db.refresh(resume)
    return resume
