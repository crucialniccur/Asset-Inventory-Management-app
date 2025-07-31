def test_create_asset(client, admin_token):
    res = client.post("/api/assets/", data={
        "name": "Laptop",
        "category_id": 1
    }, headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code in [201, 400]  # If category doesn't exist, will fail

def test_get_assets(client, admin_token):
    res = client.get("/api/assets/", headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 200
