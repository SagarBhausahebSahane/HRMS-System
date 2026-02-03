import re
from datetime import datetime

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def generate_employee_id():
    """Generate unique employee ID"""
    from employee.models import Employee
    import random
    import string
    
    while True:
        # Generate ID like EMP001, EMP002, etc.
        last_employee = Employee.objects.order_by('-created_at').first()
        if last_employee:
            last_id = int(last_employee.employee_id[3:])
            new_id = f"EMP{last_id + 1:03d}"
        else:
            new_id = "EMP001"
        
        # Check if ID exists (shouldn't but just in case)
        if not Employee.objects.filter(employee_id=new_id).exists():
            return new_id