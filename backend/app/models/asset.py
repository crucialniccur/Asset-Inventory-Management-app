from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Asset(db.Model):
    __tablename__ = 'assets'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    category = db.Column(db.String(100))
    description = db.Column(db.Text)
    image_url = db.Column(db.String)
    status = db.Column(db.String(50))  # available, allocated, under_repair

    def __repr__(self):
        return f'<Asset {self.name}>'
