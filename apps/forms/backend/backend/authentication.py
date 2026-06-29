import requests
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import BaseBackend
from django.conf import settings

User = get_user_model()

class HVTJWTBackend(BaseBackend):
    """Authenticate using JWT from HVT and create local user on the fly."""

    def authenticate(self, request, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return None

        token = auth_header.split(' ')[1]

        try:
            api_key = settings.HVT_API_KEY
            introspection_url = f"{settings.HVT_BASE_URL}/auth/token/introspect/"
            response = requests.post(
                introspection_url,
                headers={"X-API-Key": api_key},
                data={"token": token}
            )
            if response.status_code != 200:
                return None
            data = response.json()
            if not data.get('active'):
                return None

            user_id = data.get('sub')
            email = data.get('email')
            if not user_id:
                return None

            user, created = User.objects.get_or_create(
                username=f"hvt_{user_id}",
                defaults={'email': email, 'is_active': True}
            )
            return user
        except Exception:
            return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None

    # 🔥 ADD THIS METHOD
    def authenticate_header(self, request):
        return 'Bearer'
