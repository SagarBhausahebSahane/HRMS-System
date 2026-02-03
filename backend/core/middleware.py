import json
from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin
import re

class ParameterValidationMiddleware(MiddlewareMixin):
    def process_request(self, request):
        # Skip for GET requests
        if request.method in ['POST', 'PUT', 'PATCH']:
            # Check Content-Type
            content_type = request.headers.get('Content-Type', '')
            if not content_type.startswith('application/json'):
                return JsonResponse({
                    'result': 400,
                    'status': False,
                    'msg': 'Content-Type must be application/json',
                    'data': None
                }, status=400)
            
            # Validate JSON body
            try:
                if request.body:
                    data = json.loads(request.body)
            except json.JSONDecodeError:
                return JsonResponse({
                    'result': 400,
                    'status': False,
                    'msg': 'Invalid JSON format',
                    'data': None
                }, status=400)
        
        return None