from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_swagger_ui import get_swaggerui_blueprint

db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()

def init_swagger(app):
    swaggerui_blueprint = get_swaggerui_blueprint(
        '/api/docs',
        '/static/swagger.json',
        config={'app_name': "Asset Management System"}
    )
    app.register_blueprint(swaggerui_blueprint, url_prefix='/api/docs')
