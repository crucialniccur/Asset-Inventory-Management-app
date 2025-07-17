# 🧾 Asset Inventory Management App

A Flask-based API system to manage organizational assets across departments and roles. Tracks ownership, conditions, and responsibilities for assets within an organization.

---

## 🚀 Features

- Role-based access (Admin, Procurement, Finance, Employee)
- JWT Authentication and protected routes
- Asset creation and tracking
- Modular MVC folder structure
- GitFlow branching strategy

---

## 🛠 Setup Instructions

### 📦 Requirements

- Python 3.8+
- pipenv (`pip install pipenv`)
- Git
- PostgreSQL (optional — SQLite used by default)

---

### 🌱 1. Branch Management

```bash
git checkout develop             # Start from development
git checkout -b feature-1        # Create a new feature branch
```

---

### 📦 2. Set Up Virtual Environment with Pipenv

```bash
pipenv install
pipenv shell
```

---

### ⚙️ 3. Set Environment Variables

Create a `.env` file in the project root:

```env
FLASK_APP=server/app.py
FLASK_ENV=development
SECRET_KEY=your_secret_key
JWT_SECRET_KEY=your_jwt_secret
```

> Optionally add `DATABASE_URI` if using PostgreSQL

---

### 🔧 4. Initialize the Database

```bash
flask db init           # Only run once
flask db migrate -m "Initial"
flask db upgrade
```

---

### ▶️ 5. Run the Application

```bash
flask run
```

Visit the server at: [http://localhost:5000](http://localhost:5000)

---

## 📁 Project Structure

```
Asset-Inventory-Management-app/
├── server/
│   ├── __init__.py
│   ├── app.py
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   └── auth/
├── migrations/
├── .env
├── Pipfile / Pipfile.lock
└── README.md
```

---

## 🧪 Git Workflow (Followed)

```bash
git checkout develop
git checkout -b feature-1      # Create feature branch
# Make code changes
git add .
git commit -m "Feature: Added X functionality"
git push origin feature-1
```

---

## 👤 Contributors

- Samuel Karobia – Backend Developer

---

## 📜 License

MIT License
