import random
import time

# In-memory 2FA storage: {user_id: (code, timestamp)}
codes = {}

def generate_2fa_code(user_id):
    code = str(random.randint(100000, 999999))
    codes[user_id] = (code, time.time())
    return code

def validate_2fa_code(user_id, input_code, ttl=300):
    if user_id not in codes:
        return False
    stored_code, timestamp = codes[user_id]
    if time.time() - timestamp > ttl:
        del codes[user_id]
        return False
    if stored_code == input_code:
        del codes[user_id]
        return True
    return False
