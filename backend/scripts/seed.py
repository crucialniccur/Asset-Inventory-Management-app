#!/usr/bin/env python3
"""
Database seeding script for Asset Management System
Creates demo users and initial data for development/testing
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from app.extensions import db
from app.models.user import User, UserRole
from app.models.category import Category
from app.models.asset import Asset
from werkzeug.security import generate_password_hash

def seed_database():
    """Seed the database with demo data"""
    app = create_app()

    with app.app_context():
        print(" Starting database seeding...")

        # Create demo users
        users_data = [
            {
                "name": "Admin User",
                "email": "crucialniccur@gmail.com",
                "password": "adminpass",
                "role": UserRole.ADMIN,
                "department": "IT"
            },
            {
                "name": "Finance Manager",
                "email": "finance@example.com",
                "password": "financepass",
                "role": UserRole.FINANCE,
                "department": "Finance"
            },
            {
                "name": "Procurement Officer",
                "email": "procurement@example.com",
                "password": "procurementpass",
                "role": UserRole.PROCUREMENT,
                "department": "Procurement"
            },
            {
                "name": "John Employee",
                "email": "employee@example.com",
                "password": "employeepass",
                "role": UserRole.EMPLOYEE,
                "department": "Sales"
            }
        ]

        # Create users
        created_users = []
        for user_data in users_data:
            # Check if user already exists
            existing_user = User.query.filter_by(email=user_data["email"]).first()
            if existing_user:
                print(f" User {user_data['email']} already exists, skipping...")
                continue

            user = User()
            user.name = user_data["name"]
            user.email = user_data["email"]
            user.role = user_data["role"]
            user.department = user_data["department"]
            user.password_hash = generate_password_hash(user_data["password"])

            db.session.add(user)
            created_users.append(user)
            print(f" Created user: {user_data['email']} ({user_data['role'].value})")

        # Create demo categories
        categories_data = [
            {"name": "Laptops", "description": "Portable computers and laptops"},
            {"name": "Desktops", "description": "Desktop computers and workstations"},
            {"name": "Mobile Devices", "description": "Smartphones and tablets"},
            {"name": "Network Equipment", "description": "Routers, switches, and networking gear"},
            {"name": "Office Furniture", "description": "Desks, chairs, and office furniture"},
            {"name": "Software Licenses", "description": "Software licenses and subscriptions"}
        ]

        # Create categories
        created_categories = []
        for cat_data in categories_data:
            existing_category = Category.query.filter_by(name=cat_data["name"]).first()
            if existing_category:
                print(f" Category {cat_data['name']} already exists, skipping...")
                continue

            category = Category()
            category.name = cat_data["name"]
            category.description = cat_data["description"]
            db.session.add(category)
            created_categories.append(category)
            print(f" Created category: {cat_data['name']}")

        # Create demo assets
        if created_categories:
            assets_data = [
                {
                    "name": "Dell Latitude Laptop",
                    "description": "Dell Latitude 5520 Business Laptop",
                    "serial_number": "DL001234",
                    "category_id": created_categories[0].id,  # Laptops
                    "status": "available"
                },
                {
                    "name": "HP Desktop Workstation",
                    "description": "HP Z2 Mini G5 Workstation",
                    "serial_number": "HP005678",
                    "category_id": created_categories[1].id,  # Desktops
                    "status": "in_use"
                },
                {
                    "name": "iPhone 15",
                    "description": "Apple iPhone 15 128GB",
                    "serial_number": "IP001122",
                    "category_id": created_categories[2].id,  # Mobile Devices
                    "status": "available"
                }
            ]

            # Create assets
            for asset_data in assets_data:
                existing_asset = Asset.query.filter_by(serial_number=asset_data["serial_number"]).first()
                if existing_asset:
                    print(f" Asset {asset_data['serial_number']} already exists, skipping...")
                    continue

                asset = Asset()
                asset.name = asset_data["name"]
                asset.description = asset_data["description"]
                asset.serial_number = asset_data["serial_number"]
                asset.category_id = asset_data["category_id"]
                asset.status = asset_data["status"]
                asset.created_by = created_users[0].id if created_users else 1  # Admin user
                db.session.add(asset)
                print(f" Created asset: {asset_data['name']} ({asset_data['serial_number']})")

        # Commit all changes
        try:
            db.session.commit()
            print(" Database seeding completed successfully!")
            print("\n Demo Users Created:")
            for user in created_users:
                print(f"  - {user.email} / {user.role.value}")
            print("\n Login Credentials:")
            print("  - Admin: admin@example.com / adminpass")
            print("  - Finance: finance@example.com / financepass")
            print("  - Procurement: procurement@example.com / procurementpass")
            print("  - Employee: employee@example.com / employeepass")

        except Exception as e:
            db.session.rollback()
            print(f" Error seeding database: {str(e)}")
            raise

if __name__ == "__main__":
    seed_database()
