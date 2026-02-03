from django.db import models
from djongo import models as mongo_models
from employee.models import Employee

class Attendance(mongo_models.Model):
    STATUS_CHOICES = [
        ('present', 'Present'),
        ('absent', 'Absent'),
    ]
    
    employee = mongo_models.ForeignKey(Employee, on_delete=mongo_models.CASCADE, related_name='attendances')
    date = mongo_models.DateField()
    status = mongo_models.CharField(max_length=10, choices=STATUS_CHOICES)
    created_at = mongo_models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['employee', 'date']
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.employee.employee_id} - {self.date} - {self.status}"