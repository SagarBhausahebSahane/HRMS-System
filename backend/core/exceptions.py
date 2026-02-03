from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import traceback
from django.conf import settings  # Import settings to access DEBUG

def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)
    
    if response is not None:
        # Customize error response
        custom_response_data = {
            'result': response.status_code,
            'status': False,
            'msg': str(exc.detail) if hasattr(exc, 'detail') else str(exc),
            'data': None
        }
        response.data = custom_response_data
    else:
        # Handle unhandled exceptions
        error_msg = str(exc)
        error_trace = traceback.format_exc() if settings.DEBUG else None
        
        custom_response_data = {
            'result': 500,
            'status': False,
            'msg': 'Internal Server Error',
            'data': {'error': error_msg, 'trace': error_trace} if settings.DEBUG else None
        }
        response = Response(custom_response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return response