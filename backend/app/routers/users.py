from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import User, Profile
from backend.app.schemas import UserResponse, UserUpdate, ProfileUpdate, ProfileResponse
from backend.app.security.dependencies import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])


@router.put("/me", response_model=UserResponse)
def update_user_me(
    user_in: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user_in.full_name is not None:
        current_user.full_name = user_in.full_name.strip()
    db.commit()
    db.refresh(current_user)
    return current_user


@router.put("/me/profile", response_model=ProfileResponse)
def update_profile_me(
    profile_in: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        profile = Profile(user_id=current_user.id)
        db.add(profile)
    
    for field, val in profile_in.model_dump(exclude_unset=True).items():
        setattr(profile, field, val)
    
    db.commit()
    db.refresh(profile)
    return profile
