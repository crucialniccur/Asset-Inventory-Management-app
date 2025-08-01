from flask import Blueprint

from .auth import auth_bp
from .users import users_bp
from .assets import assets_bp
from .categories import categories_bp
from .requests import requests_bp
from .allocations import allocations_bp
from .finance import finance_bp
from .activity_logs import activity_logs_bp
from .reset_password import reset_bp

# Create a root blueprint
base_bp = Blueprint("base", __name__)

@base_bp.route("/")
def index():
    return {"message": "Asset Management API is live "}

def register_routes(app):
    """Register all blueprints with the Flask app"""

    app.register_blueprint(base_bp)

    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    app.register_blueprint(users_bp, url_prefix="/api/users")

    app.register_blueprint(assets_bp, url_prefix="/api/assets")

    app.register_blueprint(categories_bp, url_prefix="/api/categories")
 
    app.register_blueprint(requests_bp, url_prefix="/api/requests")
 
    app.register_blueprint(allocations_bp, url_prefix="/api/allocations")

    app.register_blueprint(finance_bp, url_prefix="/api/finance")

    app.register_blueprint(activity_logs_bp, url_prefix="/api/logs")

    app.register_blueprint(reset_bp, url_prefix="/api/auth")
    
    print("All routes registered successfully!")
    print("Available endpoints:")
    print("- /api/auth/* (login, register, logout, 2FA, password reset)")
    print("- /api/users/*")
    print("- /api/assets/*")
    print("- /api/categories/*")
    print("- /api/requests/*")
    print("- /api/allocations/*")
    print("- /api/finance/*")
    print("- /api/logs/*")