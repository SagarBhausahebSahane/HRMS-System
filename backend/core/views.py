from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import datetime
from django.http import JsonResponse

class HealthCheckView(APIView):
    def get(self, request):
        return Response({
            'result': 200,
            'status': True,
            'msg': 'HRMS Lite API is running',
            'data': {
                'timestamp': datetime.now().isoformat(),
                'service': 'HRMS Lite Backend',
                'version': '1.0.0',
                'endpoints': {
                    'employees': '/api/employees/',
                    'attendance': '/api/attendance/',
                    'health': '/'
                }
            }
        })

# Simple error handlers without NotFound import
def custom_404(request, exception=None):
    return JsonResponse({
        'result': 404,
        'status': False,
        'msg': 'Endpoint not found',
        'data': {
            'path': request.path,
            'method': request.method,
            'available_endpoints': ['/api/employees/', '/api/attendance/', '/']
        }
    }, status=404)

def custom_500(request):
    return JsonResponse({
        'result': 500,
        'status': False,
        'msg': 'Internal server error',
        'data': None
    }, status=500)

def custom_405(request, exception=None):
    return JsonResponse({
        'result': 405,
        'status': False,
        'msg': f'Method {request.method} not allowed',
        'data': {
            'path': request.path,
            'method': request.method
        }
    }, status=405)