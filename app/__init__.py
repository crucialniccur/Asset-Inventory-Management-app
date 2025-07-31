from flask import Flask
from flask_cors import CORS  # ✅ Add this line

from .config import Config
from .extensions import db, jwt, migrate, init_swagger
from .routes import register_routes

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # ✅ Add CORS configuration
    CORS(app, supports_credentials=True, origins=[
        "http://localhost:5173",  # local dev
        "https://manage-flow-ui-wg9a.vercel.app"  # Lovable preview
    ])

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    init_swagger(app)

    # Register all API routes
    register_routes(app)

    return app
