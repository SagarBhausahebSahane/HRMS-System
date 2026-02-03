from rest_framework import serializers
from .models import Employee
from core.utils import generate_employee_id
from .validators import validate_employee_data

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['employee_id', 'full_name', 'email', 'department', 'created_at']
        read_only_fields = ['employee_id', 'created_at']
    
    def validate(self, data):
        errors = validate_employee_data(data)
        if errors:
            raise serializers.ValidationError(errors)
        return data
    
    def create(self, validated_data):
        # Generate employee ID
        validated_data['employee_id'] = generate_employee_id()
        return super().create(validated_data)