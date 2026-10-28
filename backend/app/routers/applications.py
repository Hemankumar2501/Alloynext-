from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.app.database import get_db
from backend.app.models import User, JobApplication, ApplicationStageHistory
from backend.app.schemas import JobApplicationCreate, JobApplicationUpdate, JobApplicationResponse
from backend.app.security.dependencies import get_current_user

router = APIRouter(prefix="/applications", tags=["Applications"])


@router.get("/metrics/summary")
def get_metrics_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    apps = db.query(JobApplication).filter(JobApplication.user_id == current_user.id).all()
    
    total = len(apps)
    interviewing = sum(1 for a in apps if a.current_stage == "interview")
    awaiting = sum(1 for a in apps if a.current_stage in ("applied", "assessment"))
    offers = sum(1 for a in apps if a.current_stage == "offer")
    rejected = sum(1 for a in apps if a.current_stage == "rejected")
    wishlist = sum(1 for a in apps if a.current_stage == "wishlist")

    # Group by stage
    by_stage = {
        "wishlist": wishlist,
        "applied": sum(1 for a in apps if a.current_stage == "applied"),
        "assessment": sum(1 for a in apps if a.current_stage == "assessment"),
        "interview": interviewing,
        "offer": offers,
        "rejected": rejected
    }

    avg_match = int(sum(a.match_score for a in apps) / total) if total > 0 else 0

    return {
        "total_applications": total,
        "interviewing_count": interviewing,
        "awaiting_response_count": awaiting,
        "offers_count": offers,
        "average_match_score": avg_match,
        "by_stage": by_stage
    }


@router.get("", response_model=List[JobApplicationResponse])
def list_applications(
    stage: Optional[str] = Query(None, description="Filter by stage"),
    search: Optional[str] = Query(None, description="Search query for company or role"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(JobApplication).filter(JobApplication.user_id == current_user.id)
    if stage and stage.lower() != "all":
        query = query.filter(JobApplication.current_stage == stage.lower())
    if search:
        s = f"%{search.lower()}%"
        query = query.filter(
            (func.lower(JobApplication.company_name).like(s)) |
            (func.lower(JobApplication.role_title).like(s))
        )
    return query.order_by(JobApplication.applied_at.desc()).all()


@router.post("", response_model=JobApplicationResponse, status_code=status.HTTP_201_CREATED)
def create_application(
    app_in: JobApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    app_obj = JobApplication(
        user_id=current_user.id,
        company_name=app_in.company_name.strip(),
        role_title=app_in.role_title.strip(),
        job_url=app_in.job_url or "",
        location=app_in.location or "Remote",
        job_type=app_in.job_type or "Full-time",
        salary_range=app_in.salary_range or "",
        current_stage=(app_in.current_stage or "applied").lower(),
        match_score=app_in.match_score or 85,
        notes=app_in.notes or "",
        deadline=app_in.deadline,
        applied_at=datetime.now(timezone.utc)
    )
    db.add(app_obj)
    db.flush()

    # Record initial stage history
    history = ApplicationStageHistory(
        application_id=app_obj.id,
        stage=app_obj.current_stage,
        notes="Initial application recorded."
    )
    db.add(history)
    db.commit()
    db.refresh(app_obj)
    return app_obj


@router.get("/{app_id}", response_model=JobApplicationResponse)
def get_application(
    app_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    app_obj = db.query(JobApplication).filter(
        JobApplication.id == app_id,
        JobApplication.user_id == current_user.id
    ).first()
    if not app_obj:
        raise HTTPException(status_code=404, detail="Application not found.")
    return app_obj


@router.put("/{app_id}", response_model=JobApplicationResponse)
def update_application(
    app_id: str,
    app_in: JobApplicationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    app_obj = db.query(JobApplication).filter(
        JobApplication.id == app_id,
        JobApplication.user_id == current_user.id
    ).first()
    if not app_obj:
        raise HTTPException(status_code=404, detail="Application not found.")

    update_data = app_in.model_dump(exclude_unset=True)
    stage_changed = False
    old_stage = app_obj.current_stage

    if "current_stage" in update_data and update_data["current_stage"].lower() != old_stage:
        stage_changed = True
        update_data["current_stage"] = update_data["current_stage"].lower()

    for field, val in update_data.items():
        setattr(app_obj, field, val)

    if stage_changed:
        history = ApplicationStageHistory(
            application_id=app_obj.id,
            stage=app_obj.current_stage,
            notes=f"Stage updated from {old_stage} to {app_obj.current_stage}."
        )
        db.add(history)

    db.commit()
    db.refresh(app_obj)
    return app_obj


@router.delete("/{app_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_application(
    app_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    app_obj = db.query(JobApplication).filter(
        JobApplication.id == app_id,
        JobApplication.user_id == current_user.id
    ).first()
    if not app_obj:
        raise HTTPException(status_code=404, detail="Application not found.")
    db.delete(app_obj)
    db.commit()
    return None
