from rest_framework import views, status
from rest_framework.response import Response
from .models import Employee
from .serializers import EmployeeSerializer
from core.responses import CustomResponse
from datetime import datetime

class EmployeeAPIView(views.APIView):

    def get(self, request):
        """Get employees with pagination (skip and limit)"""
        try:
            # Get skip parameter (default: 0)
            skip = request.query_params.get('skip', '0')
            # Get limit parameter (default: 10)
            limit = request.query_params.get('limit', '10')

            try:
                skip = int(skip)
                limit = int(limit)
                if skip < 0 or limit <= 0:
                    return CustomResponse.error("Skip must be >= 0 and limit must be > 0", 400)
            except ValueError:
                return CustomResponse.error("Invalid skip or limit value. Must be numbers.", 400)

            # Get total count without fetching all records
            total_count = Employee.objects.count()

            # Get employees with pagination
            employees = Employee.objects.all().order_by('-created_at')[skip:skip+limit]

            serializer = EmployeeSerializer(employees, many=True)

            response_data = {
                'employees': serializer.data,
                'pagination': {
                    'skip': skip,
                    'limit': limit,
                    'total': total_count,
                    'has_more': (skip + limit) < total_count
                }
            }

            message = "Employee fetched successfully!"
            return CustomResponse.success(response_data, message)
        except Exception as e:
            return CustomResponse.error(f"Error retrieving employees: {str(e)}", 500)

    def post(self, request):
        """Create new employee"""
        try:
            serializer = EmployeeSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return CustomResponse.success(serializer.data, "Employee created successfully!", 201)
            return CustomResponse.validation_error(serializer.errors)
        except Exception as e:
            return CustomResponse.error(f"Error creating employee: {str(e)}", 500)


class EmployeeDetailAPIView(views.APIView):

    def get_object(self, employee_id):
        """Get employee by ID"""
        try:
            return Employee.objects.get(employee_id=employee_id)
        except Employee.DoesNotExist:
            return None

    def get(self, request, employee_id):
        """Get single employee"""
        employee = self.get_object(employee_id)
        if not employee:
            return CustomResponse.not_found("Employee not found")

        serializer = EmployeeSerializer(employee)
        return CustomResponse.success(serializer.data)

    def delete(self, request, employee_id):
        """Delete employee"""
        employee = self.get_object(employee_id)
        if not employee:
            return CustomResponse.not_found("Employee not found")

        try:
            employee.delete()
            return CustomResponse.success(None, "Employee deleted successfully")
        except Exception as e:
            return CustomResponse.error(f"Error deleting employee: {str(e)}", 500)


class EmployeeStatsAPIView(views.APIView):

    def get(self, request):
        """Get employee statistics (count only)"""
        try:
            # Get total count without fetching all records
            total_count = Employee.objects.count()

            return CustomResponse.success(
                {
                    'total_employees': total_count,
                    'last_updated': datetime.now().isoformat()
                },
                "Employee statistics retrieved successfully"
            )
        except Exception as e:
            return CustomResponse.error(f"Error retrieving employee statistics: {str(e)}", 500)
