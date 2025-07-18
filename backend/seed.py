from app import create_app
from app.models.user import db, User, UserRole

app = create_app()
print("DB URI:", app.config["SQLALCHEMY_DATABASE_URI"])

with app.app_context():
    # Demo users to seed
    demo_users = [
        {"name": "Admin User", "email": "admin@example.com", "password": "adminpass", "role": UserRole.admin},
        {"name": "Finance User", "email": "finance@example.com", "password": "financepass", "role": UserRole.finance},
        {"name": "Employee User", "email": "employee@example.com", "password": "employeepass", "role": UserRole.employee},
    ]

    for user_data in demo_users:
        if not User.query.filter_by(email=user_data["email"]).first():
            user = User(name=user_data["name"], email=user_data["email"], role=user_data["role"])
            user.set_password(user_data["password"])
            db.session.add(user)
            print(f"Seeded user: {user_data['email']}")
    db.session.commit()
    print("Seeding complete.")
