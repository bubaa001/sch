# create_admin.py
from app import create_app, db
from app.models import Admin

app = create_app()

with app.app_context():
    db.create_all()
    admin = Admin(username='administrator')
    admin.set_password('emoji3')
    db.session.add(admin)
    db.session.commit()
    print("Admin user created successfully!")