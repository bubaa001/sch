# Francis Maria Libermann School - Dynamic Web Service (Archive)

This directory (`backend_service/`) contains the complete dynamic Flask web service and database for Francis Maria Libermann School. 

The live site was transitioned to a **100% Static Site** to allow free hosting on Render (via Render's free Static Site tier). All backend functionalities—such as online admissions, file uploads, automated PDF confirmation generation, email dispatch via Flask-Mail, visit scheduling, admin portal, and database models—have been preserved here and were **not deleted**.

---

## What is in this directory?

- `app/`: The full Flask application package:
  - `models.py`: SQLAlchemy models (`AdmissionInquiry`, `Parent`, `Alumni`, `Feedback`, `Contact`, `Admin`, `Subscriber`, `AcademicProgram`, `Fee`).
  - `routes.py`: All public routes, admin dashboard routes, file download routes, and form handlers.
  - `templates/`: Jinja2 templates for all dynamic pages and admin dashboards.
  - `static/`: CSS styles, scripts, and original assets.
  - `utils.py`: Utility functions (e.g. CSV export).
- `instance/site.db`: The SQLite database containing all original records, schemas, and approved feedback.
- `uploads/`: Directory for uploaded applicant documents (birth certificates, report cards, etc.).
- `run.py` & `wsgi.py`: Application entry points for development and Gunicorn production.
- `create_admin.py`: Script to generate an admin user.
- `requirements.txt`: Python package requirements.

---

## How to Run the Dynamic Web Service Locally

1. Open your terminal and navigate to this folder:
   ```bash
   cd backend_service
   ```

2. Create and activate a Python virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate    # On Windows: venv\Scripts\activate
   ```

3. Install requirements:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables (optional, copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

5. Run the server:
   ```bash
   python run.py
   ```
   The dynamic website and admin portal will be accessible at `http://127.0.0.1:5000/`.

---

## How to Switch the Live Site Back to a Dynamic Web Service

If in the future you wish to host the dynamic website on a cloud web service (e.g., Render Web Service, Railway, Fly.io, or VPS):

1. **Restore Backend Files to the Root**:
   Copy the contents of `backend_service/` back to the root directory of your repository.
2. **Deploy as a Web Service**:
   - On Render: Create a **Web Service** (instead of a Static Site).
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn wsgi:app`
   - Attach a persistent disk for SQLite or supply a PostgreSQL `DATABASE_URL`.
3. **Re-enable Forms in Templates**:
   In the templates, remove the informational offline notices and uncomment the `<form>` blocks for admissions, visit scheduling, and newsletter subscriptions.
