from .config import create_app

from flask_jwt_extended import JWTManager
from flask import Flask
from .routes.auth import auth_bp

app = create_app()

# Register JWT
jwt = JWTManager(app)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/auth')
