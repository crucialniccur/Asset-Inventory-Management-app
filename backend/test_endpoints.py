#!/usr/bin/env python3
"""
Comprehensive test script for Asset Management API endpoints
"""

import requests
import json
import time

BASE_URL = "http://localhost:5000/api"

def print_response(response, endpoint):
    print(f"\n{'='*50}")
    print(f"Testing: {endpoint}")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    print(f"{'='*50}")

def test_endpoints():
    print("🚀 Starting API Endpoint Tests")
    print("="*60)

    # Test 1: Health check (if available)
    try:
        response = requests.get(f"{BASE_URL}/health")
        print_response(response, "Health Check")
    except:
        print("Health endpoint not available")

    # Test 2: Register a new user
    print("\n📝 Testing Registration...")
    register_data = {
        "name": "Test User",
        "email": "testuser@example.com",
        "password": "testpass123",
        "role": "EMPLOYEE",
        "department": "IT"
    }
    response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
    print_response(response, "Register User")

    # Test 3: Login with seeded admin
    print("\n🔐 Testing Login...")
    login_data = {
        "email": "admin@example.com",
        "password": "adminpass"
    }
    response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    print_response(response, "Login")

    # Test 4: Login with employee
    print("\n🔐 Testing Employee Login...")
    login_data = {
        "email": "employee@example.com",
        "password": "employeepass"
    }
    response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    print_response(response, "Employee Login")

    # Test 5: Test 2FA verification (you'll need to get the code from email)
    print("\n🔑 Testing 2FA Verification...")
    print("Note: You need to check your email for the 2FA code")
    print("Then run: curl -X POST http://localhost:5000/api/auth/verify-2fa")
    print("With body: {\"user_id\": 1, \"code\": \"YOUR_CODE\"}")

    # Test 6: Test protected endpoints (will fail without token)
    print("\n🔒 Testing Protected Endpoints (without token)...")

    endpoints_to_test = [
        "/categories/",
        "/assets/",
        "/users/",
        "/dashboard",
        "/requests/"
    ]

    for endpoint in endpoints_to_test:
        response = requests.get(f"{BASE_URL}{endpoint}")
        print_response(response, f"GET {endpoint}")

    # Test 7: Test with invalid token
    print("\n🚫 Testing with Invalid Token...")
    headers = {"Authorization": "Bearer invalid-token"}
    response = requests.get(f"{BASE_URL}/categories/", headers=headers)
    print_response(response, "Categories with invalid token")

    print("\n✅ Endpoint testing completed!")
    print("\n📋 Next Steps:")
    print("1. Check your email for 2FA codes")
    print("2. Use the 2FA code to get a valid JWT token")
    print("3. Test protected endpoints with the valid token")
    print("4. Test POST/PUT/DELETE operations")

if __name__ == "__main__":
    test_endpoints()
