from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from .config import Config

db = SQLAlchemy()
jwt = JWTManager()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)

    from .routes.auth import auth_bp
    from .routes.assets import assets_bp
    from .routes.requests import requests_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(assets_bp, url_prefix='/api/assets')
    app.register_blueprint(requests_bp, url_prefix='/api/requests')

    return app
