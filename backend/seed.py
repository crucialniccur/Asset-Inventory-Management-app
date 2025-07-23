# seed.py

from app import create_app
from app.models.user import db, User, UserRole

app = create_app()


def seed_users():
    with app.app_context():
        demo_users = [
            {
                "name": "Admin User",
                "email": "admin@example.com",
                "password": "adminpass",
                "role": UserRole.admin,
            },
            {
                "name": "Procurement Manager",
                "email": "procurement@example.com",
                "password": "procurepass",
                "role": UserRole.procurement,
            },
            {
                "name": "Finance User",
                "email": "finance@example.com",
                "password": "financepass",
                "role": UserRole.finance,
            },
            {
                "name": "Employee User",
                "email": "employee@example.com",
                "password": "employeepass",
                "role": UserRole.employee,
            },
        ]

        for user_data in demo_users:
            existing = User.query.filter_by(email=user_data["email"]).first()
            if not existing:
                user = User(
                    name=user_data["name"],
                    email=user_data["email"],
                    role=user_data["role"],
                )
                user.set_password(user_data["password"])
                db.session.add(user)
                print(f"Seeded user: {user.email}")
            else:
                print(f" User already exists: {user_data['email']}")

        db.session.commit()
        print("User seeding complete.")


if __name__ == "__main__":
    seed_users()
