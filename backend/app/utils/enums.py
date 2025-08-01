from enum import Enum

class UserRole(Enum):
    ADMIN = "Admin"
    PROCUREMENT = "Procurement"
    FINANCE = "Finance"
    EMPLOYEE = "Employee"

class RequestStatus(Enum):
    PENDING = "Pending"
    APPROVED = "Approved"
    REJECTED = "Rejected"
    FULFILLED = "Fulfilled"

class RequestType(Enum):
    NEW_ASSET = "New Asset"
    REPAIR = "Repair"
