from flask import Flask
from .config import Config
from .extensions import db, jwt, migrate, init_swagger
from .routes import register_routes  # Clean import for all routes

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    init_swagger(app)

    # Register all API routes
    register_routes(app)

    return app
