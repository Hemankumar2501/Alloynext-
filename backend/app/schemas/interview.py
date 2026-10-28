from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class InterviewGenerateRequest(BaseModel):
    target_company: str = Field(..., min_length=1)
    role_title: str = Field(..., min_length=1)
    job_description: Optional[str] = ""
    round_type: Optional[str] = "mixed"


class InterviewSaveRequest(BaseModel):
    target_company: str
    role_title: str
    questions: List[Dict[str, Any]]
    star_notes: Optional[Dict[str, Any]] = None


class InterviewSessionResponse(BaseModel):
    id: str
    user_id: str
    target_company: str
    role_title: str
    questions: List[Dict[str, Any]]
    star_notes: Dict[str, Any]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
