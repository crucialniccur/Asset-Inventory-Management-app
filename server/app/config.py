import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from .models.user import db  # db is already created in your models

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')

    db.init_app(app)
    migrate = Migrate(app, db)

    # Import all models so Alembic sees them for migrations
    from .models import user, asset, asset_allocation, request

    # Register JWT
    from flask_jwt_extended import JWTManager
    jwt = JWTManager(app)

    # Register blueprints
    from .routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')

    return app

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "postgresql://asset_admin_user:yoursecurepassword@localhost/asset_innit"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key")
