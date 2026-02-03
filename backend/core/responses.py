from rest_framework.response import Response
from rest_framework import status

class CustomResponse:
    @staticmethod
    def success(data=None, message="Success", status_code=200):
        return Response({
            'result': status_code,
            'status': True,
            'msg': message,
            'data': data
        }, status=status_code)
    
    @staticmethod
    def error(message="Error occurred", status_code=400, data=None):
        return Response({
            'result': status_code,
            'status': False,
            'msg': message,
            'data': data
        }, status=status_code)
    
    @staticmethod
    def validation_error(errors, message="Validation failed"):
        return Response({
            'result': 400,
            'status': False,
            'msg': message,
            'data': errors
        }, status=400)
    
    @staticmethod
    def not_found(message="Resource not found"):
        return Response({
            'result': 404,
            'status': False,
            'msg': message,
            'data': None
        }, status=404)