from flask import Blueprint, jsonify
from app.models.request import Request
from app.decorators import role_required
from flask_jwt_extended import jwt_required
from flasgger import swag_from

finrequests_bp = Blueprint('financerequests', __name__,
                           url_prefix='/finance/requests')


@finrequests_bp.route('/', methods=['GET'])
@jwt_required()
@role_required("Finance")
@swag_from({
    'tags': ['Finance Requests'],
    'description': 'Get all finance-related requests (Finance role only)',
    'responses': {
        200: {
            'description': 'List of finance requests',
            'schema': {
                'type': 'array',
                'items': {'$ref': '#/definitions/Request'}
            }
        },
        401: {'description': 'Unauthorized'},
        403: {'description': 'Forbidden'}
    }
})
def get_all_requests():
    requests = Request.query.all()
    return jsonify([r.to_dict() for r in requests]), 200
