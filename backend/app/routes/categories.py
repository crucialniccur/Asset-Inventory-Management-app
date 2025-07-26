from flask import Blueprint, request, jsonify
from app.models.category import Category
from app.models import db
from flasgger.utils import swag_from

category_bp = Blueprint('categories', __name__, url_prefix='/categories')


@category_bp.route('', methods=['GET'])
@swag_from({
    "tags": ["Categories"],
    "description": "Fetch all categories",
    "responses": {
        200: {
            "description": "List of all categories",
            "examples": {
                "application/json": [
                    {"id": 1, "name": "Laptops"},
                    {"id": 2, "name": "Monitors"}
                ]
            }
        }
    }
})
def get_categories():
    categories = Category.query.all()
    return jsonify([{"id": c.id, "name": c.name} for c in categories]), 200


@category_bp.route('', methods=['POST'])
@swag_from({
    "tags": ["Categories"],
    "description": "Create a new category",
    "parameters": [
        {
            "name": "body",
            "in": "body",
            "required": True,
            "schema": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"}
                },
                "required": ["name"]
            }
        }
    ],
    "responses": {
        201: {
            "description": "Category successfully created",
            "examples": {
                "application/json": {
                    "id": 3,
                    "name": "Projectors"
                }
            }
        },
        400: {
            "description": "Category name is required"
        },
        409: {
            "description": "Category already exists"
        }
    }
})
def create_category():
    data = request.get_json()
    name = data.get('name')

    if not name:
        return jsonify({"error": "Category name is required"}), 400

    if Category.query.filter_by(name=name).first():
        return jsonify({"error": "Category already exists"}), 409

    new_category = Category(name=name)
    db.session.add(new_category)
    db.session.commit()

    return jsonify({"id": new_category.id, "name": new_category.name}), 201
