from flask import Flask
from app.models import db, init_app_models
from dotenv import load_dotenv
import os
import cloudinary

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET'),
    secure=True
)


def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')
    db.init_app(app)

    from flask_cors import CORS
    CORS(app)

    init_app_models()

    from app.extensions import jwt
    jwt.init_app(app)

    from flask_migrate import Migrate
    Migrate(app, db)

    # 👀 Alembic auto-detects models through imports
    from app.models import user, asset, category

    # 💉 Register all your blueprints
    from app.routes.auth import auth_bp
    from app.routes.home import home_bp
    from app.routes.users import users_bp
    from app.routes.assets import assets_bp
    from app.routes.categories import category_bp
    from app.routes.admin_request import requests_bp
    from app.routes.allocation import asset_allocation_bp
    from app.routes.employee_request import employee_bp
    from app.routes.finance_request import finrequests_bp
    from app.routes.procurement_request import procurement_bp
    from app.routes.upload import upload_bp

    app.register_blueprint(users_bp)
    app.register_blueprint(category_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(home_bp)
    app.register_blueprint(assets_bp)
    app.register_blueprint(requests_bp)
    app.register_blueprint(finrequests_bp)
    app.register_blueprint(procurement_bp)
    app.register_blueprint(employee_bp)
    app.register_blueprint(asset_allocation_bp)
    app.register_blueprint(upload_bp)

    return app
