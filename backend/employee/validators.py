from django.core.exceptions import ValidationError
from core.utils import validate_email
from .models import Employee

def validate_employee_data(data):
    """Validate employee data"""
    errors = {}
    
    # Full Name validation
    if not data.get('full_name') or len(data.get('full_name', '').strip()) < 2:
        errors['full_name'] = 'Full name must be at least 2 characters'
    
    # Email validation
    email = data.get('email', '').strip()
    if not email:
        errors['email'] = 'Email is required'
    elif not validate_email(email):
        errors['email'] = 'Invalid email format'
    elif Employee.objects.filter(email=email).exists():
        errors['email'] = 'Email already exists'
    
    # Department validation
    if not data.get('department') or len(data.get('department', '').strip()) < 2:
        errors['department'] = 'Department must be at least 2 characters'
    
    return errors