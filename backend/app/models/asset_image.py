from datetime import datetime
from app.models.user import db


class AssetImage(db.Model):

    __tablename__ = 'asset_images'

    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String, nullable=False)
    uploaded_by = db.Column(
        db.Integer, db.ForeignKey('users.id'), nullable=False)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref='uploaded_images')
