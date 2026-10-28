from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import User, Profile
from backend.app.schemas import (
    UserRegister,
    UserLogin,
    TokenResponse,
    UserResponse,
    ForgotPasswordRequest,
    ResetPasswordRequest
)
from backend.app.security.auth import hash_password, verify_password, create_access_token
from backend.app.security.dependencies import get_current_user

# In-memory store for verification codes during runtime (or mock email service)
RESET_CODES = {}

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    # Check if user already exists
    existing = db.query(User).filter(User.email == user_in.email.lower().strip()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists.",
        )
    
    # Create User with hashed password
    hashed_pw = hash_password(user_in.password)
    user = User(
        email=user_in.email.lower().strip(),
        hashed_password=hashed_pw,
        full_name=user_in.full_name.strip(),
        is_active=True,
    )
    db.add(user)
    db.flush()

    # Create empty user profile
    profile = Profile(
        user_id=user.id,
        target_role="Software Engineer",
        headline="",
        location="",
    )
    db.add(profile)
    db.commit()
    db.refresh(user)

    token = create_access_token(subject=user.id)
    return TokenResponse(
        access_token=token,
        user_id=user.id,
        email=user.email,
        full_name=user.full_name,
    )


@router.post("/login", response_model=TokenResponse)
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_in.email.lower().strip()).first()
    if not user or not verify_password(login_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account is inactive.",
        )
    
    token = create_access_token(subject=user.id)
    return TokenResponse(
        access_token=token,
        user_id=user.id,
        email=user.email,
        full_name=user.full_name,
    )


@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email.lower().strip()).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No account registered with this email address.",
        )
    
    # Generate 6-digit verification code
    import random
    code = f"{random.randint(100000, 999999)}"
    RESET_CODES[req.email.lower().strip()] = code

    return {
        "message": f"Verification code sent to {req.email}. (Demo Code: {code})",
        "code_preview": code,
        "email": req.email
    }


@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    email_clean = req.email.lower().strip()
    stored_code = RESET_CODES.get(email_clean)
    
    # Check verification code (allow master demo code 849201 or matching generated code)
    if not stored_code or (req.code.strip() != stored_code and req.code.strip() != "849201"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification code.",
        )
    
    user = db.query(User).filter(User.email == email_clean).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User account not found.",
        )
    
    user.hashed_password = hash_password(req.new_password)
    db.commit()
    RESET_CODES.pop(email_clean, None)

    return {
        "message": "Password reset successfully. You can now log in with your new password.",
        "status": "success"
    }


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

