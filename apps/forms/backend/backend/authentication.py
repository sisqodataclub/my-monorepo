import requests
import logging
from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

logger = logging.getLogger(__name__)
User = get_user_model()

class HVTJWTBackend(BaseAuthentication):
    """
    DRF authentication class that validates JWT tokens via HVT introspection.
    Returns (user, None) on success, raises AuthenticationFailed otherwise.
    """

    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None

        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            return None

        token = parts[1]

        try:
            api_key = settings.HVT_API_KEY
            base = settings.HVT_BASE_URL.rstrip('/')
            # Build the introspection URL correctly (avoid double /api/v1)
            if base.endswith('/api/v1'):
                introspection_url = f"{base}/auth/token/introspect/"
            else:
                introspection_url = f"{base}/api/v1/auth/token/introspect/"

            logger.info(f"Introspecting token at {introspection_url}")

            response = requests.post(
                introspection_url,
                headers={"X-API-Key": api_key},
                data={"token": token},
                timeout=5
            )
            if response.status_code != 200:
                logger.error(f"Introspection returned {response.status_code}: {response.text}")
                raise AuthenticationFailed('Token introspection failed')

            data = response.json()
            if not data.get('active'):
                logger.warning(f"Token is inactive: {data}")
                raise AuthenticationFailed('Token is inactive or expired')

            user_id = data.get('sub')
            email = data.get('email')
            if not user_id:
                raise AuthenticationFailed('Invalid token payload')

            user, created = User.objects.get_or_create(
                username=f"hvt_{user_id}",
                defaults={'email': email, 'is_active': True}
            )
            return (user, None)

        except requests.RequestException as e:
            logger.exception("Introspection service unavailable")
            raise AuthenticationFailed(f'Introspection service unavailable: {str(e)}')
        except Exception as e:
            logger.exception("Authentication error")
            raise AuthenticationFailed(f'Authentication error: {str(e)}')

    def authenticate_header(self, request):
        return 'Bearer'
