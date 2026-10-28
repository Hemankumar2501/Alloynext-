from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class StageHistoryResponse(BaseModel):
    id: str
    application_id: str
    stage: str
    notes: Optional[str] = ""
    changed_at: datetime

    model_config = ConfigDict(from_attributes=True)


class JobApplicationBase(BaseModel):
    company_name: str = Field(..., min_length=1)
    role_title: str = Field(..., min_length=1)
    job_url: Optional[str] = ""
    location: Optional[str] = "Remote"
    job_type: Optional[str] = "Full-time"
    salary_range: Optional[str] = ""
    current_stage: Optional[str] = "applied"  # wishlist, applied, assessment, interview, offer, rejected
    match_score: Optional[int] = 0
    notes: Optional[str] = ""
    deadline: Optional[datetime] = None


class JobApplicationCreate(JobApplicationBase):
    pass


class JobApplicationUpdate(BaseModel):
    company_name: Optional[str] = None
    role_title: Optional[str] = None
    job_url: Optional[str] = None
    location: Optional[str] = None
    job_type: Optional[str] = None
    salary_range: Optional[str] = None
    current_stage: Optional[str] = None
    match_score: Optional[int] = None
    notes: Optional[str] = None
    deadline: Optional[datetime] = None


class JobApplicationResponse(JobApplicationBase):
    id: str
    user_id: str
    applied_at: datetime
    created_at: datetime
    updated_at: datetime
    stage_history: List[StageHistoryResponse] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)
