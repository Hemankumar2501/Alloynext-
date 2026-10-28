import re
from typing import Dict, List, Any, Tuple

TECH_KEYWORDS = {
    "react", "typescript", "javascript", "python", "fastapi", "django", "flask",
    "postgresql", "postgres", "sql", "mysql", "mongodb", "redis", "docker",
    "kubernetes", "aws", "gcp", "azure", "ci/cd", "git", "rest", "graphql",
    "html", "css", "tailwind", "next.js", "node.js", "express", "c++", "java",
    "go", "rust", "linux", "microservices", "unit testing", "jest", "pytest",
    "kafka", "system design", "agile", "scrum", "terraform", "grpc", "redux"
}

ACTION_VERBS = {
    "developed", "engineered", "implemented", "built", "designed", "optimized",
    "reduced", "increased", "spearheaded", "architected", "delivered", "deployed",
    "improved", "scaled", "led", "streamlined", "automated", "created"
}


def extract_keywords(text: str) -> List[str]:
    """Extracts standardized lowercase keywords from text."""
    clean_text = text.lower()
    found = set()
    for kw in TECH_KEYWORDS:
        # Match word boundaries or exact phrases
        pattern = r'(?:\b|_)' + re.escape(kw) + r'(?:\b|_)'
        if re.search(pattern, clean_text):
            found.add(kw)
    return sorted(list(found))


def count_quantified_metrics(text: str) -> int:
    """Finds metrics like percentages (32%), latencies (480ms), dollar amounts ($10k), numbers."""
    pattern = r'(\b\d+(?:\.\d+)?%|\b\d+ms|\$\d+k?|\b\d+\+\b|\b\d+\s+(?:users|requests|services|engineers|components))'
    matches = re.findall(pattern, text, flags=re.IGNORECASE)
    return len(matches)


def analyze_ats(resume_text: str, job_description: str, resume_skills: List[str] = None) -> Dict[str, Any]:
    """
    Deterministic ATS Scoring & Keyword Analysis Engine.
    Produces repeatable, objective analysis matching real applicant tracking systems.
    """
    resume_skills = resume_skills or []
    combined_resume = f"{resume_text} {' '.join(resume_skills)}".lower()
    
    jd_keywords = extract_keywords(job_description)
    resume_keywords = extract_keywords(combined_resume)
    
    # If JD didn't match pre-defined tech keywords, extract common alphanumeric tokens of length >= 4
    if len(jd_keywords) < 3:
        raw_tokens = re.findall(r'\b[a-zA-Z]{4,15}\b', job_description.lower())
        stopwords = {"with", "that", "this", "from", "have", "will", "your", "must", "work", "team", "role", "years", "experience", "candidate", "about", "skills"}
        filtered = [t for t in set(raw_tokens) if t not in stopwords]
        jd_keywords = sorted(filtered[:10])

    matched = [kw for kw in jd_keywords if kw in resume_keywords or kw in combined_resume]
    missing = [kw for kw in jd_keywords if kw not in matched]

    # 1. Keyword match ratio (45 points max)
    if jd_keywords:
        keyword_score = int((len(matched) / len(jd_keywords)) * 45)
    else:
        keyword_score = 40

    # 2. Section completeness (25 points max)
    section_score = 0
    sections_checked = {
        "contact_info": bool(re.search(r'(@|\bphone\b|\bemail\b)', combined_resume)),
        "summary": bool("summary" in combined_resume or "objective" in combined_resume or len(resume_text) > 200),
        "experience": bool("experience" in combined_resume or "employment" in combined_resume or "work" in combined_resume),
        "education": bool("education" in combined_resume or "degree" in combined_resume or "university" in combined_resume or "college" in combined_resume),
        "skills": bool("skills" in combined_resume or len(resume_skills) > 0)
    }
    for present in sections_checked.values():
        if present:
            section_score += 5

    # 3. Action verbs and quantified metrics (20 points max)
    found_verbs = [v for v in ACTION_VERBS if v in combined_resume]
    verb_points = min(10, len(found_verbs) * 2)
    metrics_count = count_quantified_metrics(resume_text)
    metric_points = min(10, metrics_count * 2)
    impact_score = verb_points + metric_points

    # 4. Length & hygiene (10 points max)
    word_count = len(resume_text.split())
    if 250 <= word_count <= 900:
        hygiene_score = 10
    elif word_count > 100:
        hygiene_score = 7
    else:
        hygiene_score = 4

    total_score = max(35, min(99, keyword_score + section_score + impact_score + hygiene_score))

    # Recommendations
    recommendations = []
    if missing:
        top_missing = missing[:4]
        recommendations.append(f"Incorporate missing core requirements: {', '.join(top_missing)}.")
    if metrics_count < 3:
        recommendations.append("Add quantifiable metrics and measurable outcomes to work experience bullets (e.g., 'reduced load time by 30%').")
    if len(found_verbs) < 3:
        recommendations.append("Strengthen bullet points with strong active engineering verbs (engineered, spearheaded, architected).")
    if not sections_checked["summary"]:
        recommendations.append("Include a concise 2-3 sentence executive professional summary targeting the role.")
    
    if not recommendations:
        recommendations.append("Your resume shows strong alignment! Tailor your project accomplishments to the target company's domain.")

    breakdown = {
        "keyword_alignment": int((len(matched) / max(1, len(jd_keywords))) * 100),
        "section_completeness": int((section_score / 25) * 100),
        "quantified_impact": int((impact_score / 20) * 100),
        "formatting_hygiene": int((hygiene_score / 10) * 100),
        "matched_count": len(matched),
        "total_required": len(jd_keywords),
        "sections_detected": sections_checked,
    }

    return {
        "match_score": total_score,
        "breakdown": breakdown,
        "matched_keywords": matched,
        "missing_keywords": missing,
        "recommendations": recommendations,
    }
