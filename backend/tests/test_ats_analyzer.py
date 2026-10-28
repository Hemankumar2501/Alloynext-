from backend.app.services.ats_analyzer import analyze_ats, extract_keywords


def test_keyword_extraction():
    text = "We are seeking a React and TypeScript engineer with Docker and PostgreSQL experience."
    keywords = extract_keywords(text)
    assert "react" in keywords
    assert "typescript" in keywords
    assert "docker" in keywords
    assert "postgresql" in keywords


def test_ats_scoring_determinism():
    resume = """
    Alex Rivera - Full Stack Engineer
    alex@example.com (555) 123-4567 San Francisco, CA
    Summary: Results-oriented engineer with 4 years experience in building high-scale web apps.
    Experience:
    • Engineered 14+ reusable React components, speeding delivery by 32%.
    • Decreased latency by 480ms using PostgreSQL indexes and Redis caching.
    • Architected microservices with Docker and Kubernetes.
    Education: BS in Computer Science.
    """
    skills = ["React", "TypeScript", "PostgreSQL", "Docker", "Redis"]

    jd = """
    Looking for a Software Engineer skilled in React, TypeScript, PostgreSQL, and Docker.
    Must have experience with microservices and automated testing.
    """

    res1 = analyze_ats(resume, jd, resume_skills=skills)
    res2 = analyze_ats(resume, jd, resume_skills=skills)

    # Must be deterministic and repeatable
    assert res1["match_score"] == res2["match_score"]
    assert res1["match_score"] >= 80
    assert "react" in res1["matched_keywords"]
    assert "typescript" in res1["matched_keywords"]
    assert "breakdown" in res1
    assert len(res1["recommendations"]) > 0
