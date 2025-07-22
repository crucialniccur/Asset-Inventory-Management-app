def init_routes(app):
    from .home import home_bp
    from .auth import auth_bp
    from .assets import asset_bp

    app.register_blueprint(home_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(asset_bp)