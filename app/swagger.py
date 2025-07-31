from flasgger import Swagger

def init_swagger(app):
    Swagger(app, template={
        "swagger": "2.0",
        "info": {
            "title": "Asset Inventory Management API",
            "description": "Manage assets, users, requests, and allocations.",
            "version": "1.0.0"
        },
        "basePath": "/",
        "schemes": ["http"],
        "securityDefinitions": {
            "Bearer": {
                "type": "apiKey",
                "name": "Authorization",
                "in": "header",
                "description": "JWT token. Format: 'Bearer <token>'"
            }
        },
        "security": [{"Bearer": []}]
    })
