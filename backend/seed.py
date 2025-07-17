from app import create_app
from app.models.user import db, User
from app.models.asset import Asset
from app.models.asset_allocation import AssetAllocation
from app.models.request import Request
from sqlalchemy import text

app = create_app()

with app.app_context():
    # Truncate all tables and restart identity for a clean slate
    db.session.execute(text('TRUNCATE TABLE asset_allocations, requests, assets, users RESTART IDENTITY CASCADE;'))
    db.session.commit()

    # Seed users
    admin = User(full_name="Admin User", email="admin@example.com", role="admin")
    admin.set_password("adminpass")
    employee = User(full_name="Employee User", email="employee@example.com", role="employee")
    employee.set_password("employeepass")

    db.session.add_all([admin, employee])
    db.session.commit()

    # Seed assets
    laptop = Asset(name="Laptop", category="Electronics", description="Dell XPS 13", image_url="http://example.com/laptop.jpg", status="available")
    chair = Asset(name="Office Chair", category="Furniture", description="Ergonomic chair", image_url="http://example.com/chair.jpg", status="available")
    db.session.add_all([laptop, chair])
    db.session.commit()

    # Seed asset allocation
    allocation = AssetAllocation(asset_id=laptop.id, user_id=employee.id)
    db.session.add(allocation)
    db.session.commit()

    # Seed request
    req = Request(
        request_type="repair",
        description="Screen flickering",
        urgency="high",
        quantity=1,
        status="pending",
        submitted_by=employee.id,
        asset_id=laptop.id
    )
    db.session.add(req)
    db.session.commit()

    print("Database seeded successfully!")
