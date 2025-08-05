#!/usr/bin/env python3
"""
Delete and recreate the test user account with proper password hashing
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from app.extensions import db
from app.models.user import User, UserRole

def recreate_test_user():
    """Delete and recreate the test user account"""
    app = create_app()

    with app.app_context():
        print(" 🔄 Recreating test user account...")

        # Delete existing user if it exists
        existing_user = User.query.filter_by(email="test@example.com").first()
        if existing_user:
            print(" 🗑️  Deleting existing test user...")
            db.session.delete(existing_user)
            db.session.commit()
            print(" ✅ Existing user deleted!")

        # Create new user with proper password hashing
        user = User()
        user.name = "Test User"
        user.email = "test@example.com"
        user.role = UserRole.ADMIN
        user.department = "IT"
        user.set_password("testpass123")

        db.session.add(user)

        try:
            db.session.commit()
            print(" ✅ Test user created successfully!")
            print(" 📧 Email: test@example.com")
            print(" 🔑 Password: testpass123")
            print(" 👤 Role: Admin")
        except Exception as e:
            db.session.rollback()
            print(f" ❌ Error creating user: {str(e)}")

if __name__ == "__main__":
    recreate_test_user()
