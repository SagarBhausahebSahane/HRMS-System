from django.urls import path, include
from core.views import HealthCheckView, custom_404, custom_500, custom_405

urlpatterns = [
    path('', HealthCheckView.as_view(), name='health-check'),
    path('api/employees/', include('employee.urls')),
    path('api/attendance/', include('attendance.urls')),
]

# Error handlers
handler404 = custom_404
handler500 = custom_500
handler405 = custom_405