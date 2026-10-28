from typing import Optional, List, Any
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class ResumeBase(BaseModel):
    title: str = Field(default="My Resume", min_length=1)
    full_name: Optional[str] = ""
    role_title: Optional[str] = ""
    email: Optional[str] = ""
    phone: Optional[str] = ""
    location: Optional[str] = ""
    linkedin: Optional[str] = ""
    github: Optional[str] = ""
    portfolio: Optional[str] = ""
    summary: Optional[str] = ""
    skills: List[str] = Field(default_factory=list)
    experience: List[Any] = Field(default_factory=list)
    education: List[Any] = Field(default_factory=list)
    projects: List[Any] = Field(default_factory=list)
    raw_text: Optional[str] = ""
    is_primary: Optional[bool] = False


class ResumeCreate(ResumeBase):
    pass


class ResumeUpdate(BaseModel):
    title: Optional[str] = None
    full_name: Optional[str] = None
    role_title: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    portfolio: Optional[str] = None
    summary: Optional[str] = None
    skills: Optional[List[str]] = None
    experience: Optional[List[Any]] = None
    education: Optional[List[Any]] = None
    projects: Optional[List[Any]] = None
    raw_text: Optional[str] = None
    is_primary: Optional[bool] = None


class ResumeResponse(ResumeBase):
    id: str
    user_id: str
    ats_score: int
    version_number: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
