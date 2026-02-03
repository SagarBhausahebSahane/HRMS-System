from rest_framework import serializers
from .models import Attendance
from employee.models import Employee
from .validators import validate_attendance_data
from datetime import datetime

class AttendanceSerializer(serializers.ModelSerializer):
    employee_id = serializers.CharField(write_only=True)
    employee_name = serializers.CharField(source='employee.full_name', read_only=True)
    employee_department = serializers.CharField(source='employee.department', read_only=True)

    class Meta:
        model = Attendance
        fields = ['employee', 'employee_id', 'employee_name', 'employee_department','date', 'status', 'created_at']
        read_only_fields = ['employee', 'created_at']

    def validate(self, data):
        # First, validate the incoming data
        errors = validate_attendance_data(self.initial_data)
        if errors:
            raise serializers.ValidationError(errors)

        # Check if employee exists
        employee_id = self.initial_data.get('employee_id')
        try:
            employee = Employee.objects.get(employee_id=employee_id)
            data['employee'] = employee
        except Employee.DoesNotExist:
            raise serializers.ValidationError({'employee_id': 'Employee not found'})

        # Get date from initial data (string) not validated data (date object)
        date_str = self.initial_data.get('date')

        # Parse date string to date object
        try:
            date_obj = datetime.strptime(date_str, '%Y-%m-%d').date()
        except (ValueError, TypeError):
            # If it's already a date object, use it directly
            if isinstance(date_str, str):
                raise serializers.ValidationError({'date': 'Date must be in YYYY-MM-DD format'})
            date_obj = date_str

        # Check for duplicate attendance
        if Attendance.objects.filter(employee=employee, date=date_obj).exists():
            raise serializers.ValidationError({'date': 'Attendance already marked for this date'})

        # Ensure the date in validated data is the date object
        data['date'] = date_obj

        return data
