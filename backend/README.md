# Asset Inventory Management System - Backend

A comprehensive Flask-based backend API for managing company assets, tracking allocations, and handling asset requests with role-based access control and 2FA authentication.

## 🚀 Quick Start

### Prerequisites
- **Python 3.8+**
- **PostgreSQL** database
- **Git**

### 1. Clone and Setup
```bash
# Clone the repository
git clone https://github.com/crucialniccur/Asset-Inventory-Management-app.git
cd Asset-Inventory-Management-app/backend

# Install dependencies
pipenv install --dev
```

### 2. Environment Configuration
Create a `.env` file in the `backend/` directory:
```bash
# Database Configuration
DATABASE_URI=postgresql://<username>:<password>@localhost/asset_management

# Security Keys
SECRET_KEY=your-super-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here

# Email Service (Mailgun) - Optional for 2FA
MAILGUN_API_KEY=your-mailgun-api-key
MAILGUN_DOMAIN=your-mailgun-domain
MAILGUN_BASE_URL=https://api.mailgun.net/v3
MAIL_FROM=postmaster@your-domain.mailgun.org

# File Upload (Cloudinary) - Optional
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### 3. Database Setup
```bash
# Create PostgreSQL database
createdb asset_management

# Run database migrations
pipenv run flask db upgrade

# Seed the database with initial data
pipenv run python scripts/seed.py
```

### 4. Start the Server
```bash
pipenv run python run.py
```

**Server will run on:** http://localhost:5000

## 🔐 Authentication & Security

### Two-Factor Authentication (2FA)
- **Enabled by default** for all user logins
- Verification codes sent via email
- 10-minute expiration time
- Can be temporarily disabled for testing

### JWT Token Authentication
- 24-hour token expiration
- Role-based access control
- Secure token storage

### Demo Users Created
After running `seed.py`, these users are available:

| Email | Password | Role | Department |
|-------|----------|------|------------|
| `crucialniccur@gmail.com` | `adminpass` | Admin | IT |
| `finance@example.com` | `financepass` | Finance | Finance |
| `procurement@example.com` | `procurementpass` | Procurement | Procurement |
| `employee@example.com` | `employeepass` | Employee | Sales |

## 📋 API Endpoints

### Authentication
- `POST /api/auth/login` - User login with 2FA
- `POST /api/auth/register` - User registration
- `POST /api/auth/verify-2fa` - 2FA verification
- `GET /api/auth/me` - Get current user profile

### User Management (Admin Only)
- `GET /api/users/` - List all users
- `POST /api/users/` - Create new user
- `PATCH /api/users/<id>/` - Update user
- `DELETE /api/users/<id>/` - Suspend user

### Asset Management
- `GET /api/assets/` - List assets
- `POST /api/assets/` - Create asset
- `GET /api/assets/<id>/` - Get asset details
- `PATCH /api/assets/<id>/` - Update asset
- `DELETE /api/assets/<id>/` - Delete asset

### Requests
- `GET /api/requests/` - List requests
- `POST /api/requests/` - Create request
- `PATCH /api/requests/<id>/` - Update request status

### Dashboard
- `GET /api/dashboard/` - Get dashboard stats

## 🛠️ Recent Changes & Updates

### ✅ Fixed Issues (Latest Updates)
1. **API Endpoint Consistency**
   - Fixed trailing slash issues
   - Updated frontend API calls to match backend routes
   - Resolved CORS preflight errors

2. **User Management Enhancement**
   - Added password field to user creation form
   - Fixed 500 errors in user creation
   - Improved validation and error handling

3. **Database Setup**
   - Fixed migration issues
   - Proper table creation with `db.create_all()`
   - Updated seed data with real admin email

4. **Authentication Improvements**
   - Restored 2FA functionality
   - Fixed JWT token handling
   - Improved error messages

### 🔧 Development Commands
```bash
# Database operations
pipenv run flask db migrate    # Create migration
pipenv run flask db upgrade    # Apply migrations
pipenv run flask db stamp head # Mark as up-to-date

# Testing
pipenv run python test_endpoints.py
pipenv run python -m pytest tests/

# Database seeding
pipenv run python scripts/seed.py
pipenv run python scripts/create_user.py

# Development server
pipenv run python run.py
```

## 🏗️ Project Structure
```
backend/
├── app/
│   ├── models/          # Database models
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic
│   ├── utils/           # Utilities and decorators
│   └── extensions.py    # Flask extensions
├── migrations/          # Database migrations
├── scripts/            # Utility scripts
├── tests/              # Test files
├── .env               # Environment variables
├── requirements.txt    # Python dependencies
└── run.py             # Application entry point
```

## 🔍 Troubleshooting

### Common Issues

**1. Database Connection Error**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Verify database exists
psql -l | grep asset_management
```

**2. Migration Issues**
```bash
# Reset migrations
pipenv run flask db stamp head
pipenv run flask db migrate
pipenv run flask db upgrade
```

**3. 2FA Email Not Sending**
- Check Mailgun configuration in `.env`
- Verify API keys and domain settings
- Check server logs for email errors

**4. CORS Errors**
- Ensure frontend is running on `http://localhost:5173`
- Check CORS configuration in `app/__init__.py`

**5. JWT Token Issues**
- Clear browser localStorage
- Re-login to get fresh token
- Check token expiration

### Debug Mode
```bash
# Enable debug logging
export FLASK_ENV=development
pipenv run python run.py
```

## 🚀 Deployment

### Production Setup
1. Set `FLASK_ENV=production`
2. Use strong SECRET_KEY and JWT_SECRET_KEY
3. Configure proper database URL
4. Set up email service for 2FA
5. Use Gunicorn for production server

### Environment Variables for Production
```bash
FLASK_ENV=production
DATABASE_URI=postgresql://user:pass@host/db
SECRET_KEY=your-production-secret-key
JWT_SECRET_KEY=your-production-jwt-key
```

## 📞 Support

For issues or questions:
- Check the troubleshooting section above
- Review server logs for error details
- Ensure all environment variables are set correctly

## 📄 License

MIT License - see LICENSE file for details
