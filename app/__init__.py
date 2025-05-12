import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_mail import Mail
from dotenv import load_dotenv

load_dotenv()  # Load .env file locally (ignored in production)

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
login_manager = LoginManager()
mail = Mail()

def create_app():
    app = Flask(__name__)
    
    # Railway provides DATABASE_URL automatically
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///site.db').replace(
        'postgres://', 'postgresql://'  # Fix for SQLAlchemy 2.0+
    )
    
    # Security and other configurations
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-fallback-key')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Flask-Mail config (if using)
    app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
    app.config['MAIL_PORT'] = os.getenv('MAIL_PORT', 587)
    app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'true').lower() == 'true'
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)
    mail.init_app(app)

    # Register blueprints
    from app.routes import main_bp
    app.register_blueprint(main_bp)

    # Create tables (if using SQLite)
    with app.app_context():
        db.create_all()

    return app

# For Gunicorn/Railway
app = create_app()
