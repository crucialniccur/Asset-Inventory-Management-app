from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.models.category import Category
from app.extensions import db
from app.utils.decorators import role_required

categories_bp = Blueprint("categories", __name__)

# ✅ Get all categories
@categories_bp.route("/", methods=["GET"])
@jwt_required()
def get_categories():
    categories = Category.query.all()
    return jsonify([{
        "id": c.id,
        "name": c.name,
        "description": c.description
    } for c in categories]), 200

# ✅ Create category (Admin, Procurement)
@categories_bp.route("/", methods=["POST"])
@jwt_required()
@role_required("Admin", "Procurement")
def create_category():
    data = request.json
    if not data.get("name"):
        return jsonify({"error": "Name is required"}), 400

    if Category.query.filter_by(name=data["name"]).first():
        return jsonify({"error": "Category already exists"}), 409

    new_category = Category(
        name=data["name"],
        description=data.get("description")
    )
    db.session.add(new_category)
    db.session.commit()
    return jsonify({"message": "Category created"}), 201

# ✅ Update category
@categories_bp.route("/<int:category_id>", methods=["PUT"])
@jwt_required()
@role_required("Admin", "Procurement")
def update_category(category_id):
    category = Category.query.get(category_id)
    if not category:
        return jsonify({"error": "Category not found"}), 404

    data = request.json
    if "name" in data:
        category.name = data["name"]
    if "description" in data:
        category.description = data["description"]

    db.session.commit()
    return jsonify({"message": "Category updated"}), 200

# ✅ Delete category
@categories_bp.route("/<int:category_id>", methods=["DELETE"])
@jwt_required()
@role_required("Admin", "Procurement")
def delete_category(category_id):
    category = Category.query.get(category_id)
    if not category:
        return jsonify({"error": "Category not found"}), 404

    db.session.delete(category)
    db.session.commit()
    return jsonify({"message": "Category deleted"}), 200
