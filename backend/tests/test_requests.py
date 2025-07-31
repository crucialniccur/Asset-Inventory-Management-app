""" create request valid data """
def test_create_new_asset_request(client, auth, db_session):
    user = auth.login()

    payload = {
        "asset_name": "Laptop",
        "type": "New Asset",
        "reason": "Need for new employee",
        "urgency": "high"
    }

    response = client.post("/requests", json=payload)
    assert response.status_code == 201

    data = response.get_json()
    assert data["asset_name"] == "Laptop"
    assert data["type"] == "New Asset"
    assert data["urgency"] == "high"
    assert data["status"] == "pending"
    assert data["user_id"] == user.id


""" create request missing req field """
def test_request_missing_reason(client, auth):
    auth.login()

    payload = {
        "asset_name": "Monitor",
        "type": "Repair",
        "urgency": "medium"
    }

    response = client.post("/requests", json=payload)
    assert response.status_code == 400
    assert "reason" in response.get_json()["errors"]


""" invalid enum """
def test_invalid_enum_type(client, auth):
    auth.login()

    payload = {
        "asset_name": "Chair",
        "type": "INVALID_TYPE",
        "reason": "Broken leg",
        "urgency": "low"
    }

    response = client.post("/requests", json=payload)
    assert response.status_code == 400
    assert "type" in response.get_json()["errors"]


""" link request logged-in user """
def test_request_links_to_user(client, auth, db_session):
    user = auth.login()

    response = client.post("/requests", json={
        "asset_name": "Desk",
        "type": "New Asset",
        "reason": "Extra workspace",
        "urgency": "medium"
    })

    from app.models import Request
    request = db_session.query(Request).filter_by(user_id=user.id).first()

    assert request is not None
    assert request.asset_name == "Desk"
    assert request.user_id == user.id


""" user only requests """
def test_get_user_requests(client, auth, db_session):
    user = auth.login()

    for name in ["Tablet", "Keyboard"]:
        client.post("/requests", json={
            "asset_name": name,
            "type": "New Asset",
            "reason": "For productivity",
            "urgency": "low"
        })

    response = client.get("/requests")
    assert response.status_code == 200

    requests = response.get_json()
    assert len(requests) == 2
    for r in requests:
        assert r["user_id"] == user.id


""" approving a request """
def test_admin_can_approve_request(client, auth, db_session):
    user = auth.login()
    
    response = client.post("/requests", json={
        "asset_name": "Printer",
        "type": "New Asset",
        "reason": "Shared office needs",
        "urgency": "medium"
    })
    request_id = response.get_json()["id"]

    response = client.patch(f"/requests/{request_id}", json={"status": "approved"})
    assert response.status_code == 200

    updated = response.get_json()
    assert updated["status"] == "approved"


""" invalid status update """
def test_invalid_status_update(client, auth):
    user = auth.login()

    response = client.post("/requests", json={
        "asset_name": "Router",
        "type": "New Asset",
        "reason": "Network upgrade",
        "urgency": "high"
    })
    request_id = response.get_json()["id"]

    response = client.patch(f"/requests/{request_id}", json={"status": "not-a-status"})
    assert response.status_code == 400
    assert "status" in response.get_json()["errors"]
# Requests test formatting
