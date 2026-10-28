import datetime
import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Boolean, Text, JSON
from sqlalchemy.orm import relationship
from backend.app.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


def utc_now():
    return datetime.datetime.now(datetime.timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False, default="")
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    # Relationships
    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    applications = relationship("JobApplication", back_populates="user", cascade="all, delete-orphan")
    analyses = relationship("JobAnalysis", back_populates="user", cascade="all, delete-orphan")
    interview_sessions = relationship("InterviewSession", back_populates="user", cascade="all, delete-orphan")


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    headline = Column(String(255), default="")
    target_role = Column(String(255), default="")
    years_of_experience = Column(Integer, default=0)
    location = Column(String(255), default="")
    phone = Column(String(50), default="")
    linkedin_url = Column(String(255), default="")
    github_url = Column(String(255), default="")
    portfolio_url = Column(String(255), default="")
    bio = Column(Text, default="")
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    user = relationship("User", back_populates="profile")


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False, default="Untitled Resume")
    full_name = Column(String(255), default="")
    role_title = Column(String(255), default="")
    email = Column(String(255), default="")
    phone = Column(String(50), default="")
    location = Column(String(255), default="")
    linkedin = Column(String(255), default="")
    github = Column(String(255), default="")
    portfolio = Column(String(255), default="")
    summary = Column(Text, default="")
    skills = Column(JSON, default=list)
    experience = Column(JSON, default=list)
    education = Column(JSON, default=list)
    projects = Column(JSON, default=list)
    ats_score = Column(Integer, default=85)
    raw_text = Column(Text, default="")
    version_number = Column(Integer, default=1)
    is_primary = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    user = relationship("User", back_populates="resumes")


class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    company_name = Column(String(255), nullable=False)
    role_title = Column(String(255), nullable=False)
    job_url = Column(String(500), default="")
    location = Column(String(255), default="Remote")
    job_type = Column(String(50), default="Full-time")
    salary_range = Column(String(100), default="")
    current_stage = Column(String(50), default="applied", index=True)  # wishlist, applied, assessment, interview, offer, rejected
    match_score = Column(Integer, default=0)
    notes = Column(Text, default="")
    deadline = Column(DateTime, nullable=True)
    applied_at = Column(DateTime, default=utc_now)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    user = relationship("User", back_populates="applications")
    stage_history = relationship("ApplicationStageHistory", back_populates="application", cascade="all, delete-orphan")


class ApplicationStageHistory(Base):
    __tablename__ = "application_stage_history"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    application_id = Column(String(36), ForeignKey("job_applications.id", ondelete="CASCADE"), nullable=False, index=True)
    stage = Column(String(50), nullable=False)
    notes = Column(Text, default="")
    changed_at = Column(DateTime, default=utc_now)

    application = relationship("JobApplication", back_populates="stage_history")


class JobAnalysis(Base):
    __tablename__ = "job_analyses"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    resume_id = Column(String(36), ForeignKey("resumes.id", ondelete="SET NULL"), nullable=True)
    target_role = Column(String(255), nullable=False)
    company = Column(String(255), default="")
    job_description = Column(Text, nullable=False)
    match_score = Column(Integer, default=0)
    breakdown = Column(JSON, default=dict)
    missing_keywords = Column(JSON, default=list)
    matched_keywords = Column(JSON, default=list)
    recommendations = Column(JSON, default=list)
    created_at = Column(DateTime, default=utc_now)

    user = relationship("User", back_populates="analyses")


class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    target_company = Column(String(255), nullable=False)
    role_title = Column(String(255), nullable=False)
    questions = Column(JSON, default=list)
    star_notes = Column(JSON, default=dict)
    created_at = Column(DateTime, default=utc_now)

    user = relationship("User", back_populates="interview_sessions")
