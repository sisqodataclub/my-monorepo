# pdf_converter/permissions.py
from rest_framework.permissions import BasePermission
from .models import PDFUser
import hmac

class HasValidAPIKey(BasePermission):
    """
    Custom permission to check for a valid API key in the X-API-Key header.
    """
    def has_permission(self, request, view):
        api_key = request.headers.get('X-API-Key')
        if not api_key:
            return False

        try:
            pdf_user = PDFUser.objects.get(api_key=api_key, is_active=True)
        except PDFUser.DoesNotExist:
            return False

        # Store the user in the request for later use (e.g., logging)
        request.pdf_user = pdf_user
        request.api_key_name = api_key[:8] + '...'
        return True
