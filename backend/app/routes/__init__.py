def init_routes(app):
    from .home import home_bp
    from .auth import auth_bp
    from .assets import assets_bp           # NOTE: assets_bp, not asset_bp
    from .admin_request import requests_bp
    from .finance_request import finrequests_bp
    from .procurement_request import procurement_bp
    from .employee_request import employee_bp
    from .allocation import asset_allocation_bp
    from .upload import upload_bp           # Added upload blueprint

    app.register_blueprint(home_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(assets_bp)      # Use assets_bp here too
    app.register_blueprint(requests_bp)
    app.register_blueprint(finrequests_bp)
    app.register_blueprint(procurement_bp)
    app.register_blueprint(employee_bp)
    app.register_blueprint(asset_allocation_bp)
    app.register_blueprint(upload_bp)       # Register upload_bp
