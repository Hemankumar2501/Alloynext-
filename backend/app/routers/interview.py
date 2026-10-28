from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import User, InterviewSession
from backend.app.schemas import InterviewGenerateRequest, InterviewSaveRequest, InterviewSessionResponse
from backend.app.security.dependencies import get_current_user
from backend.app.services.ai_service import ai_service

router = APIRouter(prefix="/interview", tags=["Interview Prep"])


@router.post("/generate")
async def generate_interview_drills(
    req: InterviewGenerateRequest,
    current_user: User = Depends(get_current_user)
):
    questions = await ai_service.generate_interview_questions(
        target_company=req.target_company,
        role_title=req.role_title,
        job_description=req.job_description or "",
        round_type=req.round_type or "mixed"
    )
    return {
        "target_company": req.target_company,
        "role_title": req.role_title,
        "questions": questions
    }


@router.post("/sessions", response_model=InterviewSessionResponse, status_code=status.HTTP_201_CREATED)
def save_interview_session(
    req: InterviewSaveRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session_obj = InterviewSession(
        user_id=current_user.id,
        target_company=req.target_company,
        role_title=req.role_title,
        questions=req.questions,
        star_notes=req.star_notes or {}
    )
    db.add(session_obj)
    db.commit()
    db.refresh(session_obj)
    return session_obj


@router.get("/sessions", response_model=List[InterviewSessionResponse])
def list_interview_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(InterviewSession).filter(
        InterviewSession.user_id == current_user.id
    ).order_by(InterviewSession.created_at.desc()).all()
