def test_create_request(client, auth, db):
    auth.login()  # Simulate a logged-in user

    response = client.post("/requests", json={
        "asset_type": "Laptop",
        "urgency": "High",
        "quantity": 2,
        "reason": "New team members"
    })

    assert response.status_code == 201
    data = response.get_json()
    assert data["asset_type"] == "Laptop"
    assert data["urgency"] == "High"
    assert data["quantity"] == 2
    assert data["status"] == "pending"

def test_request_validation(client, auth):
    auth.login()

    # Missing quantity
    response = client.post("/requests", json={
        "asset_type": "Chair",
        "urgency": "Medium",
        "reason": "Broken seat"
    })

    assert response.status_code == 400
    assert "quantity" in response.get_json()["errors"]

def test_request_belongs_to_user(client, auth, db):
    user = auth.login()
    client.post("/requests", json={
        "asset_type": "Phone",
        "urgency": "Low",
        "quantity": 1,
        "reason": "Lost phone"
    })

    from app.models import Request
    req = Request.query.filter_by(user_id=user.id).first()
    assert req is not None
    assert req.asset_type == "Phone"

def test_get_user_requests(client, auth):
    user = auth.login()
    response = client.get("/requests")
    data = response.get_json()
    assert all(r["user_id"] == user.id for r in data)
