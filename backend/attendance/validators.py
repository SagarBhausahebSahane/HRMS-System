from django.core.exceptions import ValidationError
from datetime import datetime
from .models import Attendance

def validate_attendance_data(data):
    """Validate attendance data"""
    errors = {}
    
    # Employee ID validation
    employee_id = data.get('employee_id')
    if not employee_id or not isinstance(employee_id, str):
        errors['employee_id'] = 'Employee ID is required and must be a string'
    
    # Date validation
    date_str = data.get('date')
    if not date_str:
        errors['date'] = 'Date is required'
    elif isinstance(date_str, str):
        try:
            # Validate date format
            datetime.strptime(date_str, '%Y-%m-%d')
        except ValueError:
            errors['date'] = 'Date must be in YYYY-MM-DD format'
    # If it's already a date object, it's fine
    
    # Status validation
    status = data.get('status')
    if not status:
        errors['status'] = 'Status is required'
    elif status not in ['present', 'absent']:
        errors['status'] = 'Status must be either "present" or "absent"'
    
    return errors