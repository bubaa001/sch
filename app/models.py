from datetime import datetime
from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

class AdmissionInquiry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_name = db.Column(db.String(100), nullable=False)
    date_of_birth = db.Column(db.String(10), nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    parent_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(15), nullable=False)
    form_level = db.Column(db.String(10), nullable=False)
    previous_school = db.Column(db.String(100), nullable=False)
    last_grade = db.Column(db.String(10), nullable=False)
    birth_certificate_path = db.Column(db.String(200))
    report_cards_path = db.Column(db.String(200))
    transfer_certificate_path = db.Column(db.String(200))
    medical_report_path = db.Column(db.String(200))
    parent_id_path = db.Column(db.String(200))
    message = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending_payment')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<AdmissionInquiry {self.student_name}>'

class Parent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    student_name = db.Column(db.String(100))
    phone = db.Column(db.String(15))
    volunteer_interest = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Parent {self.name}>'

class Alumni(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    graduation_year = db.Column(db.Integer, nullable=False)
    profession = db.Column(db.String(100))
    mentorship_interest = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Alumni {self.name}>'

class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(50), nullable=False)
    comment = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    approved = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Feedback {self.name}>'

class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Contact {self.name}>'

class Admin(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<Admin {self.username}>'

class Subscriber(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Subscriber {self.email}>'

# New Models for Admin Page Sections
class Content(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    section = db.Column(db.String(50), unique=True, nullable=False)  # e.g., 'story', 'leadership'
    content = db.Column(db.Text, nullable=False, default='')

    def __repr__(self):
        return f'<Content {self.section}>'

class ContactInfo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False)
    active_hours = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f'<ContactInfo {self.email}>'

class AcademicProgram(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    level = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        return f'<AcademicProgram {self.name}>'

class Fee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    form_level = db.Column(db.String(20), nullable=False)
    fee_amount = db.Column(db.Integer, nullable=False)
    notes = db.Column(db.Text)

    def __repr__(self):
        return f'<Fee {self.form_level}>'