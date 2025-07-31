def test_submit_request(client, admin_token):
    res = client.post("/api/requests/", json={
        "asset_id": 1,
        "reason": "Need for development"
    }, headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code in [201, 400]
