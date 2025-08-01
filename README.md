# Asset Inventory Management App

A comprehensive web application for managing company assets, tracking allocations, and handling asset requests with role-based access control.

## Live Demo

**Live Application:** https://manage-flow-ui-wg9a.vercel.app/

## Technologies Used

### Frontend
- React 19.1.0
- Redux Toolkit for state management
- React Router for navigation
- Tailwind CSS for styling
- Vite for build tooling
- Axios for API communication
- Formik & Yup for form handling and validation

### Backend
- Flask 2.3.3 (Python web framework)
- SQLAlchemy for ORM
- PostgreSQL database
- JWT for authentication
- Flask-Migrate for database migrations
- Cloudinary for file uploads
- Gunicorn for production deployment

## Features

- User authentication and role-based access control
- Asset management and tracking
- Asset allocation and request system
- Activity logging and audit trails
- File upload and image management
- Responsive design for mobile and desktop
- Real-time notifications and status updates

## Quick Start

### Backend Setup

1. Clone the repository
```bash
git clone https://github.com/crucialniccur/Asset-Inventory-Management-app.git
cd Asset-Inventory-Management-app/backend
```

2. Install dependencies
```bash
pipenv install --dev
```

3. Configure environment variables
```bash
# Create .env file with:
DATABASE_URL=postgresql://<user>:<password>@localhost/asset_innit
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
```

4. Setup database and run migrations
```bash
pipenv run flask db upgrade
pipenv run python seed.py
```

5. Start the server
```bash
pipenv run python run.py
```

### Frontend Setup

1. Navigate to client directory
```bash
cd ../client
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

## Demo Users

- **Admin:** admin@example.com / adminpass
- **Finance:** finance@example.com / financepass
- **Employee:** employee@example.com / employeepass

## Repository

**GitHub:** https://github.com/crucialniccur/Asset-Inventory-Management-app

## License

MIT License
