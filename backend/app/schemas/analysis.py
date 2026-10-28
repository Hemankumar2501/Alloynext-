from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class JobAnalysisRequest(BaseModel):
    target_role: str = Field(..., min_length=1)
    company: Optional[str] = ""
    job_description: str = Field(..., min_length=10)
    resume_id: Optional[str] = None
    resume_text: Optional[str] = None


class JobAnalysisResponse(BaseModel):
    id: str
    user_id: str
    target_role: str
    company: str
    job_description: str
    match_score: int
    breakdown: Dict[str, Any]
    missing_keywords: List[str]
    matched_keywords: List[str]
    recommendations: List[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
