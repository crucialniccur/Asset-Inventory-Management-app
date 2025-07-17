# backend/run.py

from flask import Flask
from app.config import Config
from app.extensions import db, migrate, jwt
from app.models import init_app_models
from app.routes import init_routes

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Register models
    init_app_models()

    # Register routes
    init_routes(app)

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
