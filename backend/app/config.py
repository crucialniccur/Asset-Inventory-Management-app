import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from .models.user import db  # db is already created in your models

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "postgresql://asset_admin_user:yoursecurepassword@localhost/asset_innit"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key")

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')

    db.init_app(app)
    migrate = Migrate(app, db)

    # Import models so they are registered with SQLAlchemy
    from .models import user, asset, asset_allocation, request

    return app
