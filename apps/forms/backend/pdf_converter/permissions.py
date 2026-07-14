# pdf_converter/permissions.py
from rest_framework.permissions import BasePermission
from django.conf import settings
import hmac

class HasValidAPIKey(BasePermission):
    """
    Custom permission to check for a valid API key in the X-API-Key header.
    """
    def has_permission(self, request, view):
        api_key = request.headers.get('X-API-Key')
        if not api_key:
            return False
        
        # Get valid keys from settings
        valid_keys = getattr(settings, 'PDF_API_KEYS', [])
        
        # Constant-time comparison to prevent timing attacks
        for valid_key in valid_keys:
            if hmac.compare_digest(api_key, valid_key):
                # Store the key name (or first 8 chars) for logging
                request.api_key_name = valid_key[:8] + '...'
                return True
        
        return False
