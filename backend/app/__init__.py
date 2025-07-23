from flask import Flask
from app.models import db

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')
    db.init_app(app)

    from app.extensions import jwt
    jwt.init_app(app)

    # Import models so Alembic sees them
    from app.models import user

    from flask_migrate import Migrate
    Migrate(app, db)

    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.home import home_bp
    from app.routes.users import users_bp  # ✅ Import users blueprint

    app.register_blueprint(auth_bp)
    app.register_blueprint(home_bp)
    app.register_blueprint(users_bp)       # ✅ Register users blueprint

    return app
