def test_register_and_login_flow(client):
    # 1. Register new account
    res = client.post(
        "/api/v1/auth/register",
        json={
            "email": "testuser@domain.com",
            "password": "StrongPassword999!",
            "full_name": "Taylor Swift"
        }
    )
    assert res.status_code == 201
    data = res.json()
    assert "access_token" in data
    assert data["email"] == "testuser@domain.com"
    token = data["access_token"]

    # 2. Reject duplicate registration
    res_dup = client.post(
        "/api/v1/auth/register",
        json={
            "email": "testuser@domain.com",
            "password": "StrongPassword999!",
            "full_name": "Taylor Swift"
        }
    )
    assert res_dup.status_code == 400

    # 3. Successful login
    res_login = client.post(
        "/api/v1/auth/login",
        json={
            "email": "testuser@domain.com",
            "password": "StrongPassword999!"
        }
    )
    assert res_login.status_code == 200
    assert "access_token" in res_login.json()

    # 4. Failed login with wrong password
    res_bad = client.post(
        "/api/v1/auth/login",
        json={
            "email": "testuser@domain.com",
            "password": "WrongPassword123"
        }
    )
    assert res_bad.status_code == 401

    # 5. Get current profile using Bearer token
    res_me = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res_me.status_code == 200
    user_info = res_me.json()
    assert user_info["email"] == "testuser@domain.com"
    assert user_info["full_name"] == "Taylor Swift"
    assert user_info["profile"] is not None
