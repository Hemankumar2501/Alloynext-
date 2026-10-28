def test_applications_lifecycle_and_stage_history(client, auth_headers):
    # 1. Initially applications list is empty for new user
    res = client.get("/api/v1/applications", headers=auth_headers)
    assert res.status_code == 200
    assert len(res.json()) == 0

    # 2. Create new application
    new_app = {
        "company_name": "Stripe",
        "role_title": "Full Stack Engineer",
        "location": "San Francisco, CA",
        "current_stage": "applied",
        "match_score": 92,
        "salary_range": "$140k - $165k"
    }
    create_res = client.post("/api/v1/applications", json=new_app, headers=auth_headers)
    assert create_res.status_code == 201
    created_data = create_res.json()
    app_id = created_data["id"]
    assert created_data["company_name"] == "Stripe"
    assert created_data["current_stage"] == "applied"
    assert len(created_data["stage_history"]) == 1

    # 3. Transition stage to 'interview'
    update_res = client.put(
        f"/api/v1/applications/{app_id}",
        json={"current_stage": "interview", "notes": "Passed initial recruiter screen."},
        headers=auth_headers
    )
    assert update_res.status_code == 200
    updated_data = update_res.json()
    assert updated_data["current_stage"] == "interview"
    assert len(updated_data["stage_history"]) == 2
    assert updated_data["stage_history"][1]["stage"] == "interview"

    # 4. Check dashboard metrics summary
    metrics_res = client.get("/api/v1/applications/metrics/summary", headers=auth_headers)
    assert metrics_res.status_code == 200
    metrics = metrics_res.json()
    assert metrics["total_applications"] == 1
    assert metrics["interviewing_count"] == 1
    assert metrics["by_stage"]["interview"] == 1

    # 5. Delete application
    del_res = client.delete(f"/api/v1/applications/{app_id}", headers=auth_headers)
    assert del_res.status_code == 204
