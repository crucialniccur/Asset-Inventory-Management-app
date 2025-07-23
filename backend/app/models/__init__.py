from flask_sqlalchemy import SQLAlchemy
from ..extensions import db

db = SQLAlchemy()

# Import models after initializing db to avoid circular imports
def init_app_models():
    from . import user
    from . import category
    from . import allocation     # ✅ Allocation must be imported before Asset
    from . import asset          # ✅ Asset depends on Allocation
    from . import request
