from flask import Blueprint, jsonify
from flasgger import swag_from

home_bp = Blueprint('home', __name__)


@home_bp.route('/')
@swag_from({
    'tags': ['Home'],
    'summary': 'API Welcome Message',
    'description': 'Simple endpoint that returns a welcome message for the API.',
    'responses': {
        200: {
            'description': 'Welcome message',
            'examples': {
                'application/json': {
                    'message': 'Welcome to the Asset Inventory Management API'
                }
            }
        }
    }
})
def home():
    return jsonify({"message": "Welcome to the Asset Inventory Management API"})
# Home route description
