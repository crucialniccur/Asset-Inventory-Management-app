from flask import Flask
from app.models import db
from flask_migrate import Migrate

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')
    db.init_app(app)
    Migrate(app, db)
    return app
