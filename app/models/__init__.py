from app.extensions import db

# Import all models to ensure they are registered with SQLAlchemy
from .user import User
from .asset import Asset
from .category import Category
from .request import Request
from .allocation import Allocation
from .budget import Budget
from .activity_log import ActivityLog  # ✅ This line registers ActivityLog

def init_app_models():
    # Optional: Initialization logic
    pass
