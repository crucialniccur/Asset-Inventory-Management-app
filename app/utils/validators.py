def is_valid_email(email):
    return "@" in email and "." in email

def is_strong_password(password):
    return len(password) >= 8
