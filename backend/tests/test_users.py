def test_get_users(client, admin_token):
    res = client.get("/api/users/", headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 200
