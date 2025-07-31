from app import create_app
from app.extensions import db
from flask_migrate import Migrate
from app.models import *  # So Flask-Migrate sees the models

from alembic.config import Config
from alembic import command
import os

app = create_app()
migrate = Migrate(app, db)

# ✅ Run `alembic stamp head` on Render to prevent duplicate migration errors
if os.environ.get("RENDER"):  # Only triggers on Render
    try:
        alembic_cfg = Config("migrations/alembic.ini")
        command.stamp(alembic_cfg, "head")
    except Exception as e:
        print("Alembic stamp failed:", e)

# ✅ Optional — start the app locally
if __name__ == "__main__":
    app.run()
