from flask import Flask
from app.models import db
from flask_cors import CORS
from app.models import init_app_models

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')
    db.init_app(app)

    CORS(app)

    from app.extensions import jwt
    jwt.init_app(app)
    init_app_models()

    # Import models so Alembic sees them
    from app.models import user


    from flask_migrate import Migrate
    Migrate(app, db)

    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.home import home_bp  # ✅ Add this line

    app.register_blueprint(auth_bp)
    app.register_blueprint(home_bp)     # ✅ Register the home blueprint

    return app
