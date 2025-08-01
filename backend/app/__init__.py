from flask import Flask
from flask_cors import CORS
from .config import Config
from .extensions import db, jwt, migrate, init_swagger
from .routes import register_routes  # Clean import for all routes

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Configure CORS
    CORS(app, 
         origins=["http://localhost:5173", "https://manage-flow-ui-wg9a.vercel.app"],
         allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         supports_credentials=True)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    init_swagger(app)

    # Register all API routes
    register_routes(app)

    return app
