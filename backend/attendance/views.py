from rest_framework import views, status
from rest_framework.response import Response
from .models import Attendance
from .serializers import AttendanceSerializer
from employee.models import Employee
from core.responses import CustomResponse
from datetime import datetime

class AttendanceAPIView(views.APIView):

    def get(self, request):
        """Get attendance records with pagination (skip and limit)"""
        try:
            # Get skip parameter (default: 0)
            skip = request.GET.get('skip', '0')
            # Get limit parameter (default: 10)
            limit = request.GET.get('limit', '10')

            try:
                skip = int(skip)
                limit = int(limit)
                if skip < 0 or limit <= 0:
                    return CustomResponse.error("Skip must be >= 0 and limit must be > 0", 400)
            except ValueError:
                return CustomResponse.error("Invalid skip or limit value. Must be numbers.", 400)

            attendance = Attendance.objects.all().order_by('-created_at')

            # Filter by employee_id if provided
            employee_id = request.GET.get('employee_id')
            if employee_id:
                attendance = attendance.filter(employee__employee_id=employee_id)

            # Filter by date if provided
            date = request.GET.get('date')
            if date:
                try:
                    date_obj = datetime.strptime(date, '%Y-%m-%d').date()
                    attendance = attendance.filter(date=date_obj)
                except ValueError:
                    return CustomResponse.error("Invalid date format. Use YYYY-MM-DD", 400)

            # Get total count
            total_count = attendance.count()

            # Apply pagination
            attendance = attendance[skip:skip+limit]

            serializer = AttendanceSerializer(attendance, many=True)

            response_data = {
                'attendance': serializer.data,
                'pagination': {
                    'skip': skip,
                    'limit': limit,
                    'total': total_count,
                    'has_more': (skip + limit) < total_count
                }
            }


            return CustomResponse.success(response_data, "Data fetched successfully!")
        except Exception as e:
            return CustomResponse.error(f"Error retrieving attendance: {str(e)}", 500)

    def post(self, request):
        """Mark attendance"""
        try:
            serializer = AttendanceSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return CustomResponse.success(serializer.data, "Attendance marked successfully!", 201)
            return CustomResponse.validation_error(serializer.errors)
        except Exception as e:
            return CustomResponse.error(f"Error marking attendance: {str(e)}", 500)


class EmployeeAttendanceAPIView(views.APIView):

    def get(self, request, employee_id):
        """Get attendance records for specific employee with pagination"""
        try:
            # Check if employee exists
            try:
                employee = Employee.objects.get(employee_id=employee_id)
            except Employee.DoesNotExist:
                return CustomResponse.not_found("Employee not found")

            # Get skip parameter (default: 0)
            skip = request.GET.get('skip', '0')
            # Get limit parameter (default: 10)
            limit = request.GET.get('limit', '10')

            try:
                skip = int(skip)
                limit = int(limit)
                if skip < 0 or limit <= 0:
                    return CustomResponse.error("Skip must be >= 0 and limit must be > 0", 400)
            except ValueError:
                return CustomResponse.error("Invalid skip or limit value. Must be numbers.", 400)

            attendance = Attendance.objects.filter(employee=employee).order_by('-date', '-created_at')

            # Get total count for this employee
            total_count = attendance.count()

            # Apply pagination
            attendance = attendance[skip:skip+limit]

            # Calculate present days from ALL records (not just paginated)
            present_days = Attendance.objects.filter(employee=employee, status='present').count()

            serializer = AttendanceSerializer(attendance, many=True)

            data = {
                'employee': {
                    'employee_id': employee.employee_id,
                    'full_name': employee.full_name,
                    'email': employee.email,
                    'department': employee.department
                },
                'attendance_records': serializer.data,
                'summary': {
                    'total_days': total_count,
                    'present_days': present_days,
                    'absent_days': total_count - present_days,
                    'present_percentage': round((present_days / total_count * 100), 2) if total_count > 0 else 0
                },
                'pagination': {
                    'skip': skip,
                    'limit': limit,
                    'total': total_count,
                    'has_more': (skip + limit) < total_count
                }
            }

            message = "Success"
            return CustomResponse.success(data, message)
        except Exception as e:
            return CustomResponse.error(f"Error retrieving attendance: {str(e)}", 500)


class AttendanceStatsAPIView(views.APIView):

    def get(self, request):
        """Get attendance statistics (count only)"""
        try:
            # Get total count without fetching all records
            total_count = Attendance.objects.count()

            # Get today's count
            today = datetime.now().date()
            today_count = Attendance.objects.filter(date=today).count()

            # Get today's present count
            today_present = Attendance.objects.filter(date=today, status='present').count()

            # Get today's absent count
            today_absent = Attendance.objects.filter(date=today, status='absent').count()

            return CustomResponse.success(
                {
                    'total_attendance': total_count,
                    'today_total': today_count,
                    'today_present': today_present,
                    'today_absent': today_absent,
                    'last_updated': datetime.now().isoformat()
                },
                "Attendance statistics retrieved successfully"
            )
        except Exception as e:
            return CustomResponse.error(f"Error retrieving attendance statistics: {str(e)}", 500)
