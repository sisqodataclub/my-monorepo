import requests
import logging
from django.conf import settings
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

logger = logging.getLogger(__name__)

class HVTRegisterView(APIView):
    """
    Proxy registration to HVT service.
    Expects POST with email, password1, password2.
    """
    def post(self, request):
        # Extract expected fields
        email = request.data.get('email')
        password1 = request.data.get('password1')
        password2 = request.data.get('password2')

        if not email or not password1 or not password2:
            return JsonResponse(
                {'error': 'email, password1, password2 are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        hvt_url = f"{settings.HVT_BASE_URL}/auth/runtime/register/"
        headers = {'X-API-Key': settings.HVT_API_KEY}
        payload = {
            'email': email,
            'password1': password1,
            'password2': password2,
        }

        try:
            response = requests.post(hvt_url, json=payload, headers=headers, timeout=5)
            response_data = response.json()
            return JsonResponse(response_data, status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.exception("HVT registration failed")
            return JsonResponse(
                {'error': f'HVT service error: {str(e)}'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )


class HVTLoginView(APIView):
    """
    Proxy login to HVT service.
    Expects POST with email and password.
    """
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return JsonResponse(
                {'error': 'email and password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        hvt_url = f"{settings.HVT_BASE_URL}/auth/runtime/login/"
        headers = {'X-API-Key': settings.HVT_API_KEY}
        payload = {
            'email': email,
            'password': password,
        }

        try:
            response = requests.post(hvt_url, json=payload, headers=headers, timeout=5)
            response_data = response.json()
            return JsonResponse(response_data, status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.exception("HVT login failed")
            return JsonResponse(
                {'error': f'HVT service error: {str(e)}'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )


class HVTMeView(APIView):
    """
    Proxy to HVT's /auth/runtime/me endpoint to get current user info.
    Requires a valid Bearer token in the Authorization header.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Extract token from Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return JsonResponse(
                {'error': 'Missing or invalid Authorization header'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        token = auth_header.split(' ')[1]  # token after "Bearer "

        hvt_url = f"{settings.HVT_BASE_URL}/auth/runtime/me/"
        headers = {'Authorization': f'Bearer {token}'}

        try:
            response = requests.get(hvt_url, headers=headers, timeout=5)
            return JsonResponse(response.json(), status=response.status_code)
        except requests.exceptions.RequestException as e:
            logger.exception("HVT me endpoint failed")
            return JsonResponse(
                {'error': f'Auth service unavailable: {str(e)}'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
