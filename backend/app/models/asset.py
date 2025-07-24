from app.models import db, category, allocation
from datetime import datetime


class Asset(db.Model):
    __tablename__ = 'assets'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey(
        'categories.id'), nullable=False)
    description = db.Column(db.Text)
    quantity = db.Column(db.Integer, default=1)
    status = db.Column(db.String(50), default='available')
    #  New field for Cloudinary image URL
    image_url = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    category = db.relationship("Category", back_populates="assets")
    allocations = db.relationship(
        "Allocation", back_populates="asset", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Asset {self.name} - {self.status}>"

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "category_id": self.category_id,
            "description": self.description,
            "quantity": self.quantity,
            "status": self.status,
            "image_url": self.image_url,  # Include in dict
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
