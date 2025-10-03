# SchoolTemplate Flask App

A Flask-based web application for school management.

## Setup

1. Clone the repo: `git clone https://github.com/bubaa001/schooltemplate.git`
2. Create a virtual environment: `python -m venv venv`
3. Activate it: `venv\Scripts\activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Run the app: `python run.py`

## Email (Gmail) configuration

To enable outgoing email using Gmail (recommended in production use an email service like SendGrid or Mailgun):

1. Enable 2-Step Verification on your Google account.
2. Create an App Password (Security -> App passwords) and choose "Mail" or "Other". Copy the 16-character password.
3. Create a `.env` file from `.env.example` and fill in the values:

```
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=true
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-16-char-app-password
MAIL_DEFAULT_SENDER=your-email@gmail.com
MAIL_SUPPRESS_SEND=false
```

4. Restart the Flask app. If you want to disable sending for development, set `MAIL_SUPPRESS_SEND=true`.
