from flask import Flask
from app.models import db, init_app_models

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')
    db.init_app(app)

    # Initialize all models to avoid circular dependency issues
    init_app_models()

    from app.extensions import jwt
    jwt.init_app(app)

    from flask_migrate import Migrate
    Migrate(app, db)

    # Import models so Alembic detects them
    from app.models import user, asset, category

    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.home import home_bp
    from app.routes.users import users_bp
    from app.routes.assets import asset_bp
    from app.routes.categories import category_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(home_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(asset_bp)
    app.register_blueprint(category_bp)

    return app
