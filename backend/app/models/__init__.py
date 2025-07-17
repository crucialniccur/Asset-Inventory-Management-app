from ..extensions import db

# Import models after initializing db to avoid circular imports
def init_app_models():
    from . import asset
    from . import category
    from . import request
    from . import allocation
    from . import user
