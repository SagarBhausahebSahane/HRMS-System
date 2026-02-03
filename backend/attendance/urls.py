from django.urls import path
from .views import AttendanceAPIView, EmployeeAttendanceAPIView, AttendanceStatsAPIView

urlpatterns = [
    path('', AttendanceAPIView.as_view(), name='attendance-list'),
    path('stats/', AttendanceStatsAPIView.as_view(), name='attendance-stats'),
    path('employee/<str:employee_id>/', EmployeeAttendanceAPIView.as_view(), name='employee-attendance'),
]
