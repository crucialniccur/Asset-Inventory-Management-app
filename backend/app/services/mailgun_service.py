import os
import requests

MAILGUN_API_KEY = os.getenv("MAILGUN_API_KEY")
MAILGUN_DOMAIN = os.getenv("MAILGUN_DOMAIN")
MAILGUN_BASE_URL = os.getenv("MAILGUN_BASE_URL")
MAIL_FROM = os.getenv("MAIL_FROM")

def send_email(recipient_email, subject, body):
    response = requests.post(
        f"{MAILGUN_BASE_URL}/{MAILGUN_DOMAIN}/messages",
        auth=("api", MAILGUN_API_KEY),
        data={
            "from": f"Asset System <{MAIL_FROM}>",
            "to": recipient_email,
            "subject": subject,
            "text": body
        }
    )
    return response.status_code == 200
