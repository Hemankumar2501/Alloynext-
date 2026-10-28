def test_resume_crud_and_primary_flag(client, auth_headers):
    # 1. Create first resume (should automatically be marked primary)
    res = client.post(
        "/api/v1/resumes",
        json={
            "title": "Full Stack Resume",
            "full_name": "Jordan Lee",
            "role_title": "Full Stack Developer",
            "summary": "Experienced engineer with React and TypeScript.",
            "skills": ["react", "typescript", "python", "docker"]
        },
        headers=auth_headers
    )
    assert res.status_code == 201
    r1 = res.json()
    assert r1["is_primary"] is True
    assert r1["ats_score"] >= 40

    # 2. Create second resume
    res2 = client.post(
        "/api/v1/resumes",
        json={
            "title": "Backend Focused Resume",
            "full_name": "Jordan Lee",
            "role_title": "Backend Engineer",
            "summary": "Designed REST APIs with PostgreSQL.",
            "skills": ["python", "fastapi", "postgresql"]
        },
        headers=auth_headers
    )
    assert res2.status_code == 201
    r2 = res2.json()
    assert r2["is_primary"] is False

    # 3. Set second resume as primary
    res_set_primary = client.post(f"/api/v1/resumes/{r2['id']}/primary", headers=auth_headers)
    assert res_set_primary.status_code == 200
    assert res_set_primary.json()["is_primary"] is True

    # 4. Verify first resume is no longer primary
    res_get_r1 = client.get(f"/api/v1/resumes/{r1['id']}", headers=auth_headers)
    assert res_get_r1.json()["is_primary"] is False
