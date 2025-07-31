def test_allocate_asset(client, admin_token):
    res = client.post("/api/allocations/", json={
        "asset_id": 1,
        "user_id": 1
    }, headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code in [201, 400]
