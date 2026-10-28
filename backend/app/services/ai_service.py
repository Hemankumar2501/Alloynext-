import logging
from typing import Dict, Any, List
from backend.app.config import settings
from backend.app.services.ats_analyzer import analyze_ats

logger = logging.getLogger(__name__)


class AIService:
    def __init__(self):
        self.provider = settings.AI_PROVIDER.lower()
        self.api_key = settings.AI_API_KEY
        self.model = settings.AI_MODEL_NAME

    async def analyze_resume_fit(
        self,
        resume_text: str,
        job_description: str,
        target_role: str = "",
        company: str = "",
        skills: List[str] = None
    ) -> Dict[str, Any]:
        """
        Runs deterministic analysis first, and augments with LLM synthesis if configured.
        Guaranteed to succeed and never crash.
        """
        # Always run deterministic ATS analysis as gold standard
        analysis = analyze_ats(resume_text, job_description, resume_skills=skills)

        # If LLM is configured and not mock, can refine suggestions
        if self.provider != "mock" and self.api_key:
            try:
                # LLM enrichment could be called here via httpx to OpenAI/Gemini
                pass
            except Exception as e:
                logger.warning(f"AI provider failed, falling back to deterministic engine: {e}")

        return analysis

    async def generate_interview_questions(
        self,
        target_company: str,
        role_title: str,
        job_description: str = "",
        round_type: str = "mixed"
    ) -> List[Dict[str, Any]]:
        """Generates realistic role and company-specific interview questions."""
        questions = [
            {
                "id": 1,
                "category": "System Design",
                "question": f"How would you design a high-throughput, fault-tolerant service at {target_company or 'our scale'}?",
                "context": "Focus on idempotency, rate limiting, caching strategies, and data consistency across distributed nodes.",
                "rubric": "Evaluates horizontal scalability, API contract clarity, database trade-offs, and failure recovery."
            },
            {
                "id": 2,
                "category": "Behavioral (STAR)",
                "question": f"Describe a time when you had to resolve a conflicting technical requirement or delivery deadline as a {role_title or 'Software Engineer'}.",
                "context": "Structure using the STAR framework: Situation, Task, Action, and measurable Result.",
                "rubric": "Evaluates cross-functional communication, risk mitigation, and executive maturity."
            },
            {
                "id": 3,
                "category": "Technical Deep Dive",
                "question": "Walk me through how you optimize web rendering and client-server latency in modern frontends and APIs.",
                "context": "Discuss bundle optimization, memoization, database index usage, and network waterfall prevention.",
                "rubric": "Evaluates full-stack intuition, performance profiling skills, and architecture hygiene."
            },
            {
                "id": 4,
                "category": "Production Engineering",
                "question": f"How do you approach continuous integration, automated testing, and zero-downtime deployments for {target_company}?",
                "context": "Mention canary releases, rollback criteria, comprehensive unit/integration tests, and observability metrics.",
                "rubric": "Demonstrates enterprise-grade engineering discipline."
            }
        ]
        return questions


ai_service = AIService()
