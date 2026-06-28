import requests
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated


class HVTLoginView(APIView):
    """Proxy login request to HVT."""
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        if not email or not password:
            return Response({'error': 'Email and password required'}, status=status.HTTP_400_BAD_REQUEST)

        hvt_url = f"{settings.HVT_BASE_URL}/auth/runtime/login/"
        headers = {'X-API-Key': settings.HVT_API_KEY}
        payload = {'email': email, 'password': password}

        try:
            response = requests.post(hvt_url, json=payload, headers=headers)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException:
            return Response({'error': 'Auth service unavailable'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)


class HVTRegisterView(APIView):
    """Proxy registration request to HVT."""
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password1 = request.data.get('password1')
        password2 = request.data.get('password2')

        if not email or not password1 or not password2:
            return Response({'error': 'All fields required'}, status=status.HTTP_400_BAD_REQUEST)

        hvt_url = f"{settings.HVT_BASE_URL}/auth/runtime/register/"
        headers = {'X-API-Key': settings.HVT_API_KEY}
        payload = {'email': email, 'password1': password1, 'password2': password2}

        try:
            response = requests.post(hvt_url, json=payload, headers=headers)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException:
            return Response({'error': 'Auth service unavailable'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)


class HVTMeView(APIView):
    """Proxy user info request to HVT using the JWT token."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # The JWT token is available via request.auth (from the HVTJWTBackend)
        token = request.auth
        hvt_url = f"{settings.HVT_BASE_URL}/auth/runtime/me/"
        headers = {'Authorization': f'Bearer {token}'}

        try:
            response = requests.get(hvt_url, headers=headers)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException:
            return Response({'error': 'Auth service unavailable'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
