from django.urls import path
from .views import EmployeeAPIView, EmployeeDetailAPIView, EmployeeStatsAPIView

urlpatterns = [
    path('', EmployeeAPIView.as_view(), name='employee-list'),
    path('stats/', EmployeeStatsAPIView.as_view(), name='employee-stats'),
    path('<str:employee_id>/', EmployeeDetailAPIView.as_view(), name='employee-detail'),
]
