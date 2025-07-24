from flask_sqlalchemy import SQLAlchemy
from ..extensions import db

db = SQLAlchemy()

# Import models after initializing db to avoid circular imports


def init_app_models():

    from .asset import Asset
    from .category import Category
    from .request import Request
    from .allocation import Allocation
    from .user import User
    from .asset_image import AssetImage
