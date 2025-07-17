from flask import Flask
from app.models import db

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')
    db.init_app(app)

    # Import models so Alembic sees them
    from app.models import user

    from flask_migrate import Migrate
    Migrate(app, db)

    # Register blueprints
    from app.routes.auth import auth_bp
    app.register_blueprint(auth_bp)

    return app
