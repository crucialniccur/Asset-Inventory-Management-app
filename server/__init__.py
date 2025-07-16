from flask import Flask
from .extensions import db, migrate, jwt
from .config import Config
from .controllers.manager_controller import manager_bp
from .controllers.auth_controller import auth_bp
from .controllers.home_controller import home_bp  # ✅ Added home_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Register blueprints
    app.register_blueprint(manager_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(home_bp)  # ✅ Registered home_bp

    return app
