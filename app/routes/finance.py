from flask import Blueprint, request, jsonify, Response
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.models.budget import Budget
from app.models.request import Request, RequestStatus
from app.utils.decorators import role_required
from datetime import datetime
import csv
import io

finance_bp = Blueprint("finance", __name__)

# ✅ Add or update budget for a department/month
@finance_bp.route("/budget", methods=["POST"])
@jwt_required()
@role_required("Finance")
def set_budget():
    data = request.json
    department = data.get("department")
    month = data.get("month")  # Format: "2025-07"
    amount = data.get("amount")

    if not all([department, month, amount]):
        return jsonify({"error": "Missing fields"}), 400

    budget = Budget.query.filter_by(department=department, month=month).first()
    if budget:
        budget.amount = amount
    else:
        budget = Budget(department=department, month=month, amount=amount)
        db.session.add(budget)

    db.session.commit()
    return jsonify({"message": "Budget updated"}), 200

# ✅ View all budgets
@finance_bp.route("/budget", methods=["GET"])
@jwt_required()
@role_required("Finance")
def view_budgets():
    budgets = Budget.query.order_by(Budget.month.desc()).all()
    return jsonify([{
        "id": b.id,
        "department": b.department,
        "month": b.month,
        "amount": b.amount
    } for b in budgets]), 200

# ✅ View spending summary (approved & estimated)
@finance_bp.route("/spending", methods=["GET"])
@jwt_required()
@role_required("Finance")
def view_spending():
    try:
        approved_requests = Request.query.filter(Request.status == RequestStatus.APPROVED.value).all()
        fulfilled_requests = Request.query.filter(Request.status == RequestStatus.FULFILLED.value).all()

        summary = {
            "approved_total": sum([r.estimated_cost or 0 for r in approved_requests]),
            "fulfilled_total": sum([r.estimated_cost or 0 for r in fulfilled_requests]),
            "count_approved": len(approved_requests),
            "count_fulfilled": len(fulfilled_requests)
        }
        return jsonify(summary), 200
    except Exception as e:
        print("🔥 ERROR IN /finance/spending:", str(e))
        return jsonify({"error": str(e)}), 500


# ✅ Export requests (CSV)
@finance_bp.route("/export", methods=["GET"])
@jwt_required()
@role_required("Finance")
def export_requests():
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Request ID", "Type", "Status", "User ID", "Estimated Cost", "Date"])

    requests = Request.query.all()
    for r in requests:
        writer.writerow([
            r.id, r.request_type.value, r.status.value, r.user_id,
            r.estimated_cost or 0, r.created_at.strftime('%Y-%m-%d')
        ])

    output.seek(0)
    return Response(output, mimetype="text/csv", headers={"Content-Disposition": "attachment; filename=financial_report.csv"})


