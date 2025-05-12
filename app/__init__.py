# app/__init__.py
import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_mail import Mail

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
login_manager = LoginManager()
mail = Mail()

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'ae7a9ae4a4fdb2bc6900825654ecc035'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USERNAME'] = 'egliszaratus@gmail.com'
    app.config['MAIL_PASSWORD'] = 'xwzd nogw tavi qgtg'  # Use your actual app password
    app.config['MAIL_DEFAULT_SENDER'] = 'egliszaratus@gmail.com'  # Add this to set the default sender

    # Initialize extensions with the app
    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)
    login_manager.login_view = 'main.admin_login'

    # Initialize Flask-Mail
    mail.init_app(app)

    # Ensure Flask-Mail is registered in the app's extensions
    with app.app_context():
        if 'mail' not in app.extensions:
            mail.init_app(app)  # Re-initialize to ensure it's properly registered

    from app.models import Admin

    @login_manager.user_loader
    def load_user(user_id):
        return Admin.query.get(int(user_id))

    from app.routes import main
    app.register_blueprint(main)

    from app.models import Subscriber

# Create tables if they don't exist
    with app.app_context():
        db.create_all()
    
    
    return app