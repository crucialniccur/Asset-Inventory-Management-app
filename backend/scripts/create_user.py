#!/usr/bin/env python3
"""
Create a new user account for testing
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from app.extensions import db
from app.models.user import User, UserRole
from werkzeug.security import generate_password_hash

def create_test_user():
    """Create a test user account"""
    app = create_app()

    with app.app_context():
        print(" Creating test user account...")

        # Check if user already exists
        existing_user = User.query.filter_by(email="test@example.com").first()
        if existing_user:
            print(" User test@example.com already exists!")
            return

        # Create new user
        user = User()
        user.name = "Test User"
        user.email = "test@example.com"
        user.role = UserRole.ADMIN
        user.department = "IT"
        user.password_hash = generate_password_hash("testpass123")

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
    create_test_user()
