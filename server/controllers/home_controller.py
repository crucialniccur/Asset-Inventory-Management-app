from flask import Blueprint, jsonify

home_bp = Blueprint("home_bp", __name__)

@home_bp.route("/", methods=["GET"])
def home():
    return jsonify(message="Welcome to the Asset Inventory Management API 🎯"), 200
