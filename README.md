# Asset Inventory Management App

## Repository

This is the official repository for the Asset Inventory Management App: [https://github.com/crucialniccur/Asset-Inventory-Management-app](https://github.com/crucialniccur/Asset-Inventory-Management-app)

---

## Backend Setup & Usage Guide

### Prerequisites
- Python 3.8
- PostgreSQL
- pipenv

### 1. Clone the repository
```sh
git clone https://github.com/crucialniccur/Asset-Inventory-Management-app.git
cd Asset-Inventory-Management-app/backend
```

### 2. Set up the Python environment
```sh
pipenv install --dev
```

### 3. Configure Environment Variables
Create a `.env` file in the `backend/` directory (or set these in your environment):
```
DATABASE_URL=postgresql://<user>:<password>@localhost/asset_innit
SECRET_KEY=super-secret-key
JWT_SECRET_KEY=super-jwt-secret-key
```
- Adjust `DATABASE_URL` as needed for your local setup.
- These are also loaded in `app/config.py`.

### 4. Database Setup
- Ensure PostgreSQL is running.
- Create the database (default: `asset_innit`).

### 5. Run Migrations
```sh
pipenv run flask db upgrade
```

### 6. Seed the Database (for development/testing)
```sh
pipenv run python seed.py
```
- This will create demo users:
  - **Admin:**    admin@example.com / adminpass
  - **Finance:**  finance@example.com / financepass
  - **Employee:** employee@example.com / employeepass

### 7. Start the Backend Server
```sh
pipenv run python run.py
```
- The server will run on `http://localhost:5000/` by default.

---

## Authentication & API Usage

### Auth Endpoints
- **Login:** `POST /auth/login`
- **Get User Info:** `GET /auth/me` (requires JWT)
- **Ping:** `GET /auth/ping`

### Example: Login as Admin
```sh
curl -i -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "adminpass"}'
```

### Example: Get Current User Info
After login, copy the `access_token` from the response:
```sh
curl -i http://localhost:5000/auth/me \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### Example: Ping Endpoint
```sh
curl -i http://localhost:5000/auth/ping
```

---

## Project Structure

- `backend/app/models/`   - SQLAlchemy models
- `backend/app/routes/`   - Flask blueprints (auth, etc.)
- `backend/app/utils/`    - Utility functions and decorators
- `backend/seed.py`       - Database seeding script
- `backend/run.py`        - App entry point
- `backend/app/config.py` - App configuration

---

## Development Best Practices
- Use the app factory pattern (`create_app()` in `app/__init__.py`).
- Register all blueprints in the app factory.
- Initialize all extensions (db, JWTManager, etc.) in the app factory.
- Use environment variables for secrets and database URIs.
- Commit frequently with clear messages.
- Never commit secrets or `.env` files.

---

## License

MIT License
# Project README update
