from server.extensions import db
from datetime import datetime

class Asset(db.Model):
    __tablename__ = "assets"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    image_url = db.Column(db.String, nullable=True)
    condition = db.Column(db.String(100), default="Good")
    status = db.Column(db.String(100), default="available")  # e.g., available, allocated, under_repair
    date_added = db.Column(db.DateTime, default=datetime.utcnow)

    # Foreign key: who the asset is allocated to (nullable)
    assigned_to = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)

    def __repr__(self):
        return f"<Asset {self.name} - {self.category}>"
