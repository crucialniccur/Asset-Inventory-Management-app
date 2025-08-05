#!/usr/bin/env python3
"""
Create a test user account with real email for 2FA testing
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from app.extensions import db
from app.models.user import User, UserRole

def create_real_test_user():
    """Create a test user account with real email"""
    app = create_app()

    with app.app_context():
        print(" 🔄 Creating test user with real email...")

        # Delete existing test users if they exist
        existing_test_user = User.query.filter_by(email="test@example.com").first()
        if existing_test_user:
            print(" 🗑️  Deleting existing test user...")
            db.session.delete(existing_test_user)
            db.session.commit()

        # Check if real email user already exists
        existing_real_user = User.query.filter_by(email="crucialniccur@gmail.com").first()
        if existing_real_user:
            print(" 🗑️  Deleting existing user with real email...")
            db.session.delete(existing_real_user)
            db.session.commit()

        # Create new user with real email
        user = User()
        user.name = "Test User"
        user.email = "crucialniccur@gmail.com"  # Your real email
        user.role = UserRole.ADMIN
        user.department = "IT"
        user.set_password("testpass123")

        db.session.add(user)

        try:
            db.session.commit()
            print(" ✅ Test user created successfully!")
            print(" 📧 Email: crucialniccur@gmail.com")
            print(" 🔑 Password: testpass123")
            print(" 👤 Role: Admin")
            print(" 📨 2FA codes will be sent to your real email!")
        except Exception as e:
            db.session.rollback()
            print(f" ❌ Error creating user: {str(e)}")

if __name__ == "__main__":
    create_real_test_user()
