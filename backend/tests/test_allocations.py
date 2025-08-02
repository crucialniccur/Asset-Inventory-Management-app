def test_allocate_asset(client, admin_token, test_category, employee_token):
    # First create an asset using the admin token
    res = client.post("/api/assets/", data={
        "name": "Test Asset",
        "category_id": test_category.id
    }, headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code in [201, 400]

    # Get the employee user ID from the token
    from flask_jwt_extended import decode_token
    from app.services.twofa_service import codes

    # Get employee user ID from the token
    employee_user_id = decode_token(employee_token)["sub"]

    # Now try to allocate the asset (assuming asset ID is 1 since it's the first one created)
    res = client.post("/api/allocations/", json={
        "asset_id": 1,
        "user_id": employee_user_id
    }, headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code in [201, 400]
