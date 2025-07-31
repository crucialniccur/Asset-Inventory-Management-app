def test_create_category(client, admin_token):
    res = client.post("/api/categories/", json={
        "name": "Electronics"
    }, headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 201

def test_get_categories(client, admin_token):
    res = client.get("/api/categories/", headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 200
