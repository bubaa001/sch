import os
import uuid
from datetime import datetime
from io import BytesIO
from werkzeug.utils import secure_filename
from flask import Blueprint, render_template, request, redirect, url_for, flash, send_file, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from flask_mail import Message
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from . import db, mail
from .models import AdmissionInquiry, Parent, Alumni, Feedback, Contact, Admin, Subscriber
from .utils import export_to_csv

main = Blueprint('main', __name__)

# File upload configuration for admissions
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'jpg', 'jpeg', 'png'}

# Ensure the upload directory exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Helper function to generate Admission PDF with NMB payment instructions
def generate_admission_pdf(student_name, parent_name, form_level, system_code):
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    c.setFont("Helvetica", 16)
    c.drawString(100, 750, "Francis Maria Libermann School")
    c.setFont("Helvetica", 12)
    c.drawString(100, 730, "Admission Application Confirmation")
    c.drawString(100, 700, f"Student Name: {student_name}")
    c.drawString(100, 680, f"Parent Name: {parent_name}")
    c.drawString(100, 660, f"Form Level: {form_level}")
    c.drawString(100, 640, f"System Code: {system_code}")
    c.drawString(100, 620, f"Status: Pending Payment")
    c.drawString(100, 600, f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    c.drawString(100, 580, "Payment Instructions:")
    c.drawString(100, 560, "Please make a bank transfer to the following account:")
    c.drawString(100, 540, "Bank: NMB")
    c.drawString(100, 520, "Account Number: 444444444444")
    c.drawString(100, 500, "Amount: TZS 150,000 (Application Fee: TZS 50,000 + Admission Fee: TZS 100,000)")
    c.drawString(100, 480, f"Reference: Include the System Code ({system_code}) in the payment reference.")
    c.drawString(100, 460, "After payment, please email a payment confirmation to fmlibermann@gmail.com.")
    c.showPage()
    c.save()
    buffer.seek(0)
    return buffer

# ======== Admin Routes ========
@main.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if current_user.is_authenticated:
        return redirect(url_for('main.admin_dashboard'))
    
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        admin = Admin.query.filter_by(username=username).first()
        
        if admin and admin.check_password(password):
            login_user(admin)
            return redirect(url_for('main.admin_dashboard'))
        else:
            flash('Invalid username or password.', 'danger')
            return redirect(url_for('main.admin_login'))
    
    return render_template('admin_login.html')

@main.route('/admin/logout')
@login_required
def admin_logout():
    logout_user()
    flash('You have been logged out.', 'success')
    return redirect(url_for('main.index'))

@main.route('/admin/dashboard')
@login_required
def admin_dashboard():
    total_admissions = AdmissionInquiry.query.count()
    total_feedback = Feedback.query.count()
    pending_feedback = Feedback.query.filter_by(approved=False).count()
    total_contacts = Contact.query.count()
    total_parents = Parent.query.count()
    total_alumni = Alumni.query.count()

    return render_template('admin_dashboard.html',
                          total_admissions=total_admissions,
                          total_feedback=total_feedback,
                          pending_feedback=pending_feedback,
                          total_contacts=total_contacts,
                          total_parents=total_parents,
                          total_alumni=total_alumni)

@main.route('/admin/admissions', methods=['GET', 'POST'])
@login_required
def admin_admissions():
    search_query = request.form.get('search', '') if request.method == 'POST' else ''
    if search_query:
        applications = AdmissionInquiry.query.filter(
            (AdmissionInquiry.student_name.ilike(f'%{search_query}%')) |
            (AdmissionInquiry.parent_name.ilike(f'%{search_query}%')) |
            (AdmissionInquiry.email.ilike(f'%{search_query}%'))
        ).all()
    else:
        applications = AdmissionInquiry.query.all()

    if request.form.get('action') == 'update_status':
        app_id = request.form.get('app_id')
        new_status = request.form.get('status')
        application = AdmissionInquiry.query.get_or_404(app_id)
        application.status = new_status
        db.session.commit()
        flash(f'Status updated to {new_status}!', 'success')

        # Notify parents if status is "accepted" or "paid"
        if new_status in ['accepted', 'paid']:
            msg_to_parents = Message(
                subject=f"Admission Application Update - Francis Maria Libermann School",
                recipients=[application.email],
                body=f"Dear {application.parent_name},\n\nThe status of {application.student_name}'s application for admission to Francis Maria Libermann School has been updated to '{new_status}' for Form {application.form_level}.\n\nBest regards,\nFrancis Maria Libermann School Admissions Team"
            )
            try:
                mail.send(msg_to_parents)
                flash('Parents have been notified of the status update.', 'success')
            except Exception as e:
                flash(f'Failed to notify parents. Error: {str(e)}', 'warning')
                main.logger.error(f"Failed to notify parents: {str(e)}")

        return redirect(url_for('main.admin_admissions'))

    if request.form.get('export'):
        columns = [
            ('ID', 'id'),
            ('Student Name', 'student_name'),
            ('Parent Name', 'parent_name'),
            ('Email', 'email'),
            ('Form Level', 'form_level'),
            ('Status', 'status'),
            ('Created At', 'created_at')
        ]
        return export_to_csv(applications, columns, 'admissions.csv')

    return render_template('admin_admissions.html', applications=applications, search_query=search_query)

@main.route('/admin/feedback', methods=['GET', 'POST'])
@login_required
def admin_feedback():
    if request.method == 'POST':
        feedback_id = request.form.get('feedback_id')
        action = request.form.get('action')
        feedback = Feedback.query.get_or_404(feedback_id)

        if action == 'approve':
            feedback.approved = True
            db.session.commit()
            flash('Feedback approved successfully!', 'success')
        elif action == 'delete':
            db.session.delete(feedback)
            db.session.commit()
            flash('Feedback deleted successfully!', 'success')

        return redirect(url_for('main.admin_feedback'))

    feedbacks = Feedback.query.all()
    return render_template('admin_feedback.html', feedbacks=feedbacks)

@main.route('/admin/contacts', methods=['GET', 'POST'])
@login_required
def admin_contacts():
    search_query = request.form.get('search', '') if request.method == 'POST' else ''
    if search_query:
        contacts = Contact.query.filter(
            (Contact.name.ilike(f'%{search_query}%')) |
            (Contact.email.ilike(f'%{search_query}%')) |
            (Contact.message.ilike(f'%{search_query}%'))
        ).all()
    else:
        contacts = Contact.query.all()
    
    if request.form.get('export'):
        columns = [
            ('ID', 'id'),
            ('Name', 'name'),
            ('Email', 'email'),
            ('Message', 'message'),
            ('Created At', 'created_at')
        ]
        return export_to_csv(contacts, columns, 'contacts.csv')

    return render_template('admin_contacts.html', contacts=contacts, search_query=search_query)

@main.route('/admin/parents', methods=['GET', 'POST'])
@login_required
def admin_parents():
    search_query = request.form.get('search', '') if request.method == 'POST' else ''
    if search_query:
        parents = Parent.query.filter(
            (Parent.name.ilike(f'%{search_query}%')) |
            (Parent.email.ilike(f'%{search_query}%')) |
            (Parent.student_name.ilike(f'%{search_query}%'))
        ).all()
    else:
        parents = Parent.query.all()
    
    if request.form.get('export'):
        columns = [
            ('ID', 'id'),
            ('Name', 'name'),
            ('Email', 'email'),
            ('Student Name', 'student_name'),
            ('Phone', 'phone'),
            ('Volunteer Interest', 'volunteer_interest'),
            ('Created At', 'created_at')
        ]
        return export_to_csv(parents, columns, 'parents.csv')

    return render_template('admin_parents.html', parents=parents, search_query=search_query)

@main.route('/admin/alumni', methods=['GET', 'POST'])
@login_required
def admin_alumni():
    search_query = request.form.get('search', '') if request.method == 'POST' else ''
    if search_query:
        alumni = Alumni.query.filter(
            (Alumni.name.ilike(f'%{search_query}%')) |
            (Alumni.email.ilike(f'%{search_query}%')) |
            (Alumni.profession.ilike(f'%{search_query}%'))
        ).all()
    else:
        alumni = Alumni.query.all()
    
    if request.form.get('export'):
        columns = [
            ('ID', 'id'),
            ('Name', 'name'),
            ('Email', 'email'),
            ('Graduation Year', 'graduation_year'),
            ('Profession', 'profession'),
            ('Mentorship Interest', 'mentorship_interest'),
            ('Created At', 'created_at')
        ]
        return export_to_csv(alumni, columns, 'alumni.csv')

    return render_template('admin_alumni.html', alumni=alumni, search_query=search_query)

@main.route('/admin/download/<path:filename>')
@login_required
def download_file(filename):
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    if os.path.exists(file_path):
        return send_file(file_path, as_attachment=True)
    else:
        flash('File not found.', 'danger')
        return redirect(url_for('main.admin_admissions'))

# ======== Core Application Routes ========
@main.route('/')
def index():
    feedback_list = Feedback.query.filter_by(approved=True).all()
    return render_template('index.html', feedback_list=feedback_list, current_page='index')

@main.route('/about')
def about():
    return render_template('about.html', current_page='about')

@main.route('/school-life')
def school_life():
    return render_template('school-life.html', current_page='school-life')

@main.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip()
        message = request.form.get('message', '').strip()

        if name and email and message:
            new_contact = Contact(name=name, email=email, message=message)
            db.session.add(new_contact)
            db.session.commit()
            msg = Message(subject=f"New Contact Form Submission from {name}",
                          recipients=['fmlibermann@gmail.com'],
                          body=f"Name: {name}\nEmail: {email}\nMessage: {message}")
            try:
                mail.send(msg)
                main.logger.info(f"Contact form email sent successfully from {name} ({email})")
                return jsonify({'success': True, 'message': 'Message sent successfully! We will get back to you soon.', 'category': 'success'})
            except Exception as e:
                main.logger.error(f"Failed to send contact form email from {name} ({email}): {str(e)}")
                return jsonify({'success': False, 'message': f'Message saved, but failed to send email. Error: {str(e)}', 'category': 'warning'})
        else:
            return jsonify({'success': False, 'message': 'Please fill out all fields.', 'category': 'danger'})
    
    return render_template('contact.html', current_page='contact')

@main.route('/community', methods=['GET', 'POST'])
def community():
    if request.method == 'POST':
        if 'parent_submit' in request.form:
            name = request.form.get('name', '').strip()
            email = request.form.get('email', '').strip()
            student_name = request.form.get('student_name', '').strip()
            phone = request.form.get('phone', '').strip()
            volunteer = 'volunteer' in request.form

            if name and email:
                new_parent = Parent(
                    name=name,
                    email=email,
                    student_name=student_name,
                    phone=phone,
                    volunteer_interest=volunteer
                )
                db.session.add(new_parent)
                db.session.commit()
                msg = Message(subject=f"New Parent Registration from {name}",
                              recipients=['fmlibermann@gmail.com'],
                              body=f"Name: {name}\nEmail: {email}\nStudent Name: {student_name}\nPhone: {phone}\nVolunteer Interest: {volunteer}")
                try:
                    mail.send(msg)
                    main.logger.info(f"Parent registration email sent successfully from {name} ({email})")
                    return jsonify({'success': True, 'message': 'Thank you for registering! We’ll be in touch soon.', 'category': 'success'})
                except Exception as e:
                    main.logger.error(f"Failed to send parent registration email from {name} ({email}): {str(e)}")
                    return jsonify({'success': False, 'message': f'Registration saved, but failed to send email. Error: {str(e)}', 'category': 'warning'})
            else:
                return jsonify({'success': False, 'message': 'Please provide name and email.', 'category': 'danger'})

        elif 'alumni_submit' in request.form:
            name = request.form.get('name', '').strip()
            email = request.form.get('email', '').strip()
            graduation_year = request.form.get('graduation_year', '').strip()
            profession = request.form.get('profession', '').strip()
            mentor = 'mentor' in request.form

            if name and email and graduation_year:
                new_alumni = Alumni(
                    name=name,
                    email=email,
                    graduation_year=int(graduation_year),
                    profession=profession,
                    mentorship_interest=mentor
                )
                db.session.add(new_alumni)
                db.session.commit()
                msg = Message(subject=f"New Alumni Registration from {name}",
                              recipients=['fmlibermann@gmail.com'],
                              body=f"Name: {name}\nEmail: {email}\nGraduation Year: {graduation_year}\nProfession: {profession}\nMentorship Interest: {mentor}")
                try:
                    mail.send(msg)
                    main.logger.info(f"Alumni registration email sent successfully from {name} ({email})")
                    return jsonify({'success': True, 'message': 'Thank you for joining the alumni network!', 'category': 'success'})
                except Exception as e:
                    main.logger.error(f"Failed to send alumni registration email from {name} ({email}): {str(e)}")
                    return jsonify({'success': False, 'message': f'Registration saved, but failed to send email. Error: {str(e)}', 'category': 'warning'})
            else:
                return jsonify({'success': False, 'message': 'Please provide name, email, and graduation year.', 'category': 'danger'})

    return render_template('community.html', current_page='community')

@main.route('/admissions', methods=['GET', 'POST'])
def admissions():
    if request.method == 'POST':
        student_name = request.form.get('student_name', '').strip()
        date_of_birth = request.form.get('date_of_birth', '').strip()
        gender = request.form.get('gender', '').strip()
        parent_name = request.form.get('parent_name', '').strip()
        email = request.form.get('email', '').strip()
        phone = request.form.get('phone', '').strip()
        form_level = request.form.get('form_level', '').strip()
        previous_school = request.form.get('previous_school', '').strip()
        last_grade = request.form.get('last_grade', '').strip()
        message = request.form.get('message', '')

        required_fields = {
            'Student Name': student_name,
            'Date of Birth': date_of_birth,
            'Gender': gender,
            'Parent Name': parent_name,
            'Email': email,
            'Phone': phone,
            'Form Level': form_level,
            'Previous School': previous_school,
            'Last Grade': last_grade
        }
        for field_name, field_value in required_fields.items():
            if not field_value:
                return jsonify({'success': False, 'message': f'{field_name} is required.', 'category': 'danger'})

        if '@' not in email or '.' not in email:
            return jsonify({'success': False, 'message': 'Please provide a valid email address.', 'category': 'danger'})

        if not phone.isdigit() or len(phone) < 10:
            return jsonify({'success': False, 'message': 'Please provide a valid phone number (at least 10 digits).', 'category': 'danger'})

        files = {
            'birth_certificate': request.files.get('birth_certificate'),
            'report_cards': request.files.get('report_cards'),
            'transfer_certificate': request.files.get('transfer_certificate'),
            'medical_report': request.files.get('medical_report'),
            'parent_id': request.files.get('parent_id')
        }

        file_paths = {}
        total_attachment_size = 0
        for field, file in files.items():
            main.logger.info(f"Processing file: {field} for student: {student_name}")
            if file and allowed_file(file.filename):
                try:
                    filename = secure_filename(file.filename)
                    file_path = os.path.join(UPLOAD_FOLDER, f"{field}_{student_name}_{filename}")
                    main.logger.info(f"Saving file: {filename} to {file_path}")
                    file.save(file_path)
                    file_paths[field + '_path'] = file_path
                    file_size = os.path.getsize(file_path)
                    total_attachment_size += file_size
                    main.logger.info(f"File {filename} saved successfully. Size: {file_size} bytes")
                except Exception as e:
                    main.logger.error(f"Error saving file {file.filename} for student: {student_name}. Error: {str(e)}")
                    return jsonify({'success': False, 'message': f'Error saving {field.replace("_", " ")}. Error: {str(e)}', 'category': 'danger'})
            elif field in ['birth_certificate', 'report_cards', 'medical_report', 'parent_id'] and not file:
                main.logger.warning(f"Missing required file: {field} for student: {student_name}")
                return jsonify({'success': False, 'message': f'Please upload a valid {field.replace("_", " ")}.', 'category': 'danger'})

        if total_attachment_size > 25 * 1024 * 1024:
            return jsonify({'success': False, 'message': 'Total size of uploaded files exceeds 25MB. Please reduce file sizes and try again.', 'category': 'danger'})

        # Save the application to the database
        new_inquiry = AdmissionInquiry(
            student_name=student_name,
            date_of_birth=date_of_birth,
            gender=gender,
            parent_name=parent_name,
            email=email,
            phone=phone,
            form_level=form_level,
            previous_school=previous_school,
            last_grade=last_grade,
            birth_certificate_path=file_paths.get('birth_certificate_path', ''),
            report_cards_path=file_paths.get('report_cards_path', ''),
            transfer_certificate_path=file_paths.get('transfer_certificate_path', ''),
            medical_report_path=file_paths.get('medical_report_path', ''),
            parent_id_path=file_paths.get('parent_id_path', ''),
            message=message,
            status='pending_payment'
        )
        db.session.add(new_inquiry)
        db.session.commit()

        # Generate a unique system code
        system_code = str(uuid.uuid4())

        # Generate the admission PDF with payment instructions
        admission_pdf = generate_admission_pdf(student_name, parent_name, form_level, system_code)

        # Send email to parent with the PDF
        msg_to_parent = Message(
            subject="Admission Application Confirmation - Francis Maria Libermann School",
            recipients=[email],
            body=f"Dear {parent_name},\n\nThank you for submitting an admission application for {student_name} at Francis Maria Libermann School. Please find attached the admission confirmation with payment instructions.\n\nBest regards,\nFrancis Maria Libermann School Admissions Team"
        )
        msg_to_parent.attach(
            filename=f"Admission_Confirmation_{student_name}.pdf",
            content_type='application/pdf',
            data=admission_pdf.read()
        )

        # Send email to school with the application details and attachments
        msg_to_school = Message(
            subject=f"New Admission Inquiry from {parent_name}",
            recipients=['fmlibermann@gmail.com'],
            body=f"Student Name: {student_name}\nDate of Birth: {date_of_birth}\nGender: {gender}\nParent Name: {parent_name}\nEmail: {email}\nPhone: {phone}\nForm Level: {form_level}\nPrevious School: {previous_school}\nLast Grade: {last_grade}\nMessage: {message}\n\nSystem Code: {system_code}"
        )
        for field in ['birth_certificate_path', 'report_cards_path', 'transfer_certificate_path', 'medical_report_path', 'parent_id_path']:
            file_path = file_paths.get(field)
            if file_path:
                file_extension = file_path.rsplit('.', 1)[1].lower()
                content_type = 'application/pdf' if file_extension == 'pdf' else 'image/jpeg' if file_extension in ['jpg', 'jpeg'] else 'image/png'
                with open(file_path, 'rb') as f:
                    msg_to_school.attach(
                        filename=f"{field}_{student_name}_{os.path.basename(file_path)}",
                        content_type=content_type,
                        data=f.read()
                    )

        try:
            mail.send(msg_to_parent)
            mail.send(msg_to_school)
            main.logger.info(f"Admission application emails sent successfully to {email} and school")
            return jsonify({'success': True, 'message': 'Application submitted successfully! Please check your email for payment instructions.', 'category': 'success'})
        except Exception as e:
            main.logger.error(f"Failed to send admission application emails to {email} and school: {str(e)}")
            return jsonify({'success': False, 'message': f'Application saved, but failed to send email. Error: {str(e)}', 'category': 'warning'})

    return render_template('admissions.html', current_page='admissions')
@main.route('/submit_feedback', methods=['POST'])
def submit_feedback():
    main.logger.info("Submitting feedback...")
    name = request.form.get('name', '').strip()
    email = request.form.get('email', '').strip()
    feedback = request.form.get('feedback', '').strip()
    main.logger.info(f"Feedback received: Name: {name}, Email: {email}, Feedback: {feedback}")


    if name and email and feedback:
        msg = Message(subject=f"New Feedback from {name}",
                      recipients=['fmlibermann@gmail.com'],
                      body=f"Name: {name}\nEmail: {email}\nFeedback: {feedback}")
        try:
            mail.send(msg)
            main.logger.info(f"Feedback email sent successfully from {name} ({email})")
            return jsonify({'success': True, 'message': 'Thank you for your feedback!', 'category': 'success'})
        except Exception as e:
            main.logger.error(f"Failed to send feedback email from {name} ({email}). Error: {str(e)}")
            return jsonify({'success': False, 'message': f'Failed to send your feedback. Error: {str(e)}', 'category': 'danger'})
    else:
        main.logger.warning("Feedback submission failed: Please fill out all fields.")
        return jsonify({'success': False, 'message': 'Please fill out all fields.', 'category': 'danger'})

@main.route('/arrange_visit', methods=['POST'])
def arrange_visit():
    main.logger.info("Submitting visit application...")
    name = request.form.get('name', '').strip()
    email = request.form.get('email', '').strip()
    phone = request.form.get('phone', '').strip()
    date = request.form.get('date', '').strip()
    message = request.form.get('message', '')
    main.logger.info(f"Visit application received: Name: {name}, Email: {email}, Phone: {phone}, Date: {date}, Message: {message}")

    if name and email and phone and date:
        msg_to_school = Message(subject=f"New Visit Application from {name}",
                                recipients=['fmlibermann@gmail.com'],
                                body=f"Name: {name}\nEmail: {email}\nPhone: {phone}\nPreferred Date: {date}\nMessage: {message}")
        msg_to_applicant = Message(subject="Visit Application Confirmation - Francis Maria Libermann School",
                                   recipients=[email],
                                   body=f"Dear {name},\n\nThank you for scheduling a visit to Francis Maria Libermann School on {date}. We have received your application and will confirm your visit soon.\n\nBest regards,\nFrancis Maria Libermann School Team")

        try:
            main.logger.info(f"Sending visit application emails to school and applicant ({email})")
            mail.send(msg_to_school)
            mail.send(msg_to_applicant)
            main.logger.info(f"Visit application emails sent successfully to school and applicant ({email})")
            flash('Your visit application has been submitted successfully! A confirmation email has been sent to your inbox.', 'success')
            return jsonify({'success': True, 'message': 'Your visit application has been submitted successfully! A confirmation email has been sent to your inbox.', 'category': 'success', 'flash': 'Your visit application has been submitted successfully! A confirmation email has been sent to your inbox.', 'flash_category': 'success'})
        except Exception as e:
            flash(f'Failed to submit your visit application. Error: {str(e)}', 'danger')
            return jsonify({'success': False, 'message': f'Failed to submit your visit application. Error: {str(e)}', 'category': 'danger', 'flash': f'Failed to submit your visit application. Error: {str(e)}', 'flash_category': 'danger'})
    else:
        flash('Please fill out all required fields.', 'danger')
        return jsonify({'success': False, 'message': 'Please fill out all required fields.', 'category': 'danger', 'flash': 'Please fill out all required fields.', 'flash_category': 'danger'})
@main.route('/submit_contact', methods=['POST'])
def submit_contact():
    main.logger.info("Checking if main.logger is available")
    main.logger.info("Submitting contact form...")
    name = request.form.get('name', '').strip()
    email = request.form.get('email', '').strip()
    message = request.form.get('message', '').strip()
    main.logger.info(f"Contact form received: Name: {name}, Email: {email}, Message: {message}")


    if name and email and message:
        new_contact = Contact(name=name, email=email, message=message)
        db.session.add(new_contact)
        db.session.commit()
        msg = Message(subject=f"New Contact Form Submission from {name}",
                      recipients=['fmlibermann@gmail.com'],
                      body=f"Name: {name}\nEmail: {email}\nMessage: {message}")
        try:
            main.logger.info(f"Sending contact form email from {name} ({email})")
            mail.send(msg)
            main.logger.info(f"Contact form email sent successfully from {name} ({email})")
            msg_str = 'Your message has been sent successfully! We will get back to you soon.'
            flash(msg_str, 'success')
            return jsonify({
                'success': True, 
                'message': msg_str, 
                'category': 'success'
            })
        except Exception as e:
            main.logger.error(f"Failed to send contact form email from {name} ({email}). Error: {str(e)}")
            msg_str = f'Failed to send your message. Error: {str(e)}'
            flash(msg_str, 'danger')
            return jsonify({
                'success': False, 
                'message': msg_str, 
                'category': 'danger'
            })
    else:
        main.logger.warning("Contact form submission failed: Please fill out all fields.")
        msg_str = 'Please fill out all fields.'
        flash(msg_str, 'danger')
        return jsonify({
            'success': False, 
            'message': msg_str, 
            'category': 'danger'
        })

@main.route('/events')
def events():
    return render_template('events.html', current_page='events')

@main.route('/submit_volunteer', methods=['POST'])
def submit_volunteer():
    name = request.form.get('name', '').strip()
    email = request.form.get('email', '').strip()
    phone = request.form.get('phone', '').strip()
    interest = request.form.get('interest', '').strip()

    if name and email and phone and interest:
        msg = Message(subject=f"New Volunteer Sign-Up from {name}",
                      recipients=['fmlibermann@gmail.com'],
                      body=f"Name: {name}\nEmail: {email}\nPhone: {phone}\nArea of Interest: {interest}")
        try:
            mail.send(msg)
            main.logger.info(f"Volunteer sign-up email sent successfully from {name} ({email})")
            return jsonify({'success': True, 'message': 'Thank you for signing up to volunteer! We’ll be in touch soon.', 'category': 'success'})
        except Exception as e:
            main.logger.error(f"Failed to send volunteer sign-up email from {name} ({email}): {str(e)}")
            return jsonify({'success': False, 'message': f'Failed to send your volunteer sign-up. Error: {str(e)}', 'category': 'danger'})
    else:
        return jsonify({'success': False, 'message': 'Please fill out all fields.', 'category': 'danger'})

@main.route('/feedback', methods=['GET', 'POST'])
def feedback():
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        role = request.form.get('role', '').strip()
        comment = request.form.get('comment', '').strip()
        rating = request.form.get('rating', '').strip()

        if name and role and comment and rating:
            new_feedback = Feedback(
                name=name,
                role=role,
                comment=comment,
                rating=int(rating),
                approved=False
            )
            db.session.add(new_feedback)
            db.session.commit()
            msg = Message(subject=f"New Feedback Submission from {name}",
                          recipients=['fmlibermann@gmail.com'],
                          body=f"Name: {name}\nRole: {role}\nComment: {comment}\nRating: {rating}\nApproved: {new_feedback.approved}")
            try:
                mail.send(msg)
                if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                    return jsonify({'success': True, 'message': 'Feedback submitted for moderation. Thank you for your input!', 'category': 'success'})
                else:
                    flash('Feedback submitted for moderation. Thank you for your input!', 'success')
                    return redirect(url_for('main.feedback'))
            except Exception as e:
                if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                    return jsonify({'success': False, 'message': f'Feedback saved, but failed to send email. Error: {str(e)}', 'category': 'warning'})
                else:
                    flash(f'Feedback saved, but failed to send email. Error: {str(e)}', 'warning')
                    return redirect(url_for('main.feedback'))
        else:
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return jsonify({'success': False, 'message': 'Please complete all fields.', 'category': 'danger'})
            else:
                flash('Please complete all fields.', 'danger')
                return redirect(url_for('main.feedback'))

    approved_feedback = Feedback.query.filter_by(approved=True).all()
    return render_template('student-feedback.html',
                           feedback_list=approved_feedback,
                           current_page='feedback')

@main.route('/subscribe', methods=['POST'])
def subscribe():
    if request.headers.get('X-Requested-With') != 'XMLHttpRequest':
        return jsonify({'success': False, 'category': 'danger', 'message': 'Invalid request'}), 400

    email = request.form.get('email')
    if not email:
        return jsonify({'success': False, 'category': 'danger', 'message': 'Email is required'}), 400

    # Basic email validation (already handled by HTML, but adding server-side check)
    if '@' not in email or '.' not in email:
        return jsonify({'success': False, 'category': 'danger', 'message': 'Invalid email address'}), 400

    # Check if email already exists
    existing_subscriber = Subscriber.query.filter_by(email=email).first()
    if existing_subscriber:
        return jsonify({'success': False, 'category': 'warning', 'message': 'This email is already subscribed'}), 400

    # Add new subscriber to the database
    try:
        subscriber = Subscriber(email=email)
        db.session.add(subscriber)
        db.session.commit()

        # Send confirmation email to the subscriber
        msg_to_subscriber = Message(
            subject="Newsletter Subscription Confirmation - Francis Maria Libermann School",
            recipients=[email],
            body=f"Dear Subscriber,\n\nThank you for subscribing to the Francis Maria Libermann School newsletter! You'll receive the latest news and updates from us.\n\nBest regards,\nFrancis Maria Libermann School Team"
        )
        mail.send(msg_to_subscriber)

        # Notify the school
        msg_to_school = Message(
            subject=f"New Newsletter Subscription from {email}",
            recipients=['fmlibermann@gmail.com'],
            body=f"A new user has subscribed to the newsletter.\nEmail: {email}"
        )
        mail.send(msg_to_school)
        main.logger.info(f"Newsletter subscription email sent successfully to {email} and school")

        return jsonify({'success': True, 'category': 'success', 'message': 'Thank you for subscribing! A confirmation email has been sent.'})
    except Exception as e:
        db.session.rollback()
        main.logger.error(f"Failed to send newsletter subscription emails to {email} and school: {str(e)}")
        return jsonify({'success': False, 'category': 'danger', 'message': f'An error occurred: {str(e)}'}), 500