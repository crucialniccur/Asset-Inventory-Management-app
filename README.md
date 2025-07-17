# Asset Inventory Management App

## Repository

This is the official repository for the Asset Inventory Management App: [https://github.com/crucialniccur/Asset-Inventory-Management-app](https://github.com/crucialniccur/Asset-Inventory-Management-app)

## Backend Setup Instructions

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

### 3. Configure the database
- Ensure PostgreSQL is running.
- Create a database (default: `asset_innit`).
- Update the `DATABASE_URL` in `app/config.py` or set it as an environment variable if needed.

### 4. Run migrations
```sh
pipenv run flask db upgrade
```

### 5. Seed the database (for development/testing)
```sh
pipenv run python seed.py
```

### 6. Start the backend server
```sh
pipenv run python run.py
```

### 7. Test authentication endpoints
- Register: `POST /auth/register`
- Login: `POST /auth/login`
- Get user info: `GET /auth/me` (requires JWT in Authorization header)

## Project Structure

- `backend/app/models/` - SQLAlchemy models
- `backend/app/routes/` - Flask routes (auth, etc.)
- `backend/app/utils/` - Utility functions and decorators
- `backend/seed.py` - Database seeding script
- `backend/run.py` - App entry point

## License

MIT License
