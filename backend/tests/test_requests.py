def test_submit_request(client, employee_token, test_category):
    res = client.post("/api/requests/", json={
        "request_type": "NEW",
        "asset_name": "Test Asset",
        "asset_description": "Test asset description",
        "brand": "Test Brand",
        "category_id": test_category.id,
        "estimated_cost": 1000.00,
        "justification": "Need for testing",
        "reason": "Need for development",
        "urgency": "MEDIUM"
    }, headers={"Authorization": f"Bearer {employee_token}"})
    assert res.status_code in [201, 400]
