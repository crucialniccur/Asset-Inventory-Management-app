from app.services.twofa_service import codes

def test_register_and_login(client):
    # Register
    res = client.post("/api/auth/register", json={
        "name": "Test User",
        "email": "test@example.com",
        "password": "test123",
        "role": "EMPLOYEE"
    })
    assert res.status_code == 201

    # Login (this will trigger 2FA)
    res = client.post("/api/auth/login", json={
        "email": "test@example.com",
        "password": "test123"
    })
    assert res.status_code == 200
    response_data = res.get_json()
    assert "requires2FA" in response_data
    assert response_data["requires2FA"] == True
    assert "user_id" in response_data

    # Get the 2FA code that was generated
    user_id = response_data["user_id"]
    assert user_id in codes
    code, _ = codes[user_id]

    # Verify 2FA and get access token
    res = client.post("/api/auth/verify-2fa", json={
        "user_id": user_id,
        "code": code
    })
    assert res.status_code == 200
    response_data = res.get_json()
    assert "token" in response_data
