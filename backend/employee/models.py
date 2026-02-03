from django.db import models
from djongo import models as mongo_models

class Employee(mongo_models.Model):
    employee_id = mongo_models.CharField(max_length=20, unique=True, primary_key=True)
    full_name = mongo_models.CharField(max_length=100)
    email = mongo_models.EmailField(unique=True)
    department = mongo_models.CharField(max_length=50)
    created_at = mongo_models.DateTimeField(auto_now_add=True)
    updated_at = mongo_models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.employee_id} - {self.full_name}"