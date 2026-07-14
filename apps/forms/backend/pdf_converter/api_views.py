# pdf_converter/api_views.py
import io
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.http import FileResponse
from django.shortcuts import get_object_or_404
from django.contrib.auth import login
from django.utils import timezone
from .auth_service import AuthService
from .models import EmailLoginCode, PDFTemplate, PDFExport
from .serializers import PDFTemplateSerializer, PDFExportSerializer, PDFGenerateSerializer
from .services import PDFService
from .permissions import HasValidAPIKey


# ============================================================
# 🔐 Authentication API Views – PUBLIC (no API key required)
# ============================================================

class RequestLoginView(APIView):
    """
    React calls this to request a magic link email.
    No authentication required.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response(
                {'error': 'Email is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            AuthService.send_login_email(request, email)
            return Response({
                'success': True,
                'message': 'Magic link sent to your email. Check your inbox!',
                'email': email
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VerifyLoginView(APIView):
    """
    React calls this to verify the magic link code.
    No authentication required.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        code = request.data.get('code')
        if not code:
            return Response(
                {'error': 'Code is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            login_code = EmailLoginCode.objects.get(code=code)
        except EmailLoginCode.DoesNotExist:
            return Response(
                {'error': 'Invalid or expired login link.'},
                status=status.HTTP_404_NOT_FOUND
            )

        if not login_code.is_valid():
            return Response(
                {'error': 'This link has expired or has already been used.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Mark as used
        login_code.is_used = True
        login_code.save()

        # Log the user in (creates session)
        user = login_code.user
        login(request, user)
        request.session.set_expiry(604800)  # 7 days

        return Response({
            'success': True,
            'message': 'Successfully logged in!',
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username,
            }
        }, status=status.HTTP_200_OK)


class LogoutView(APIView):
    """
    Log out the user (clear session).
    No authentication required (but you could restrict to authenticated users if preferred).
    """
    permission_classes = [AllowAny]

    def post(self, request):
        request.session.flush()
        return Response({'success': True, 'message': 'Logged out successfully'})


# ============================================================
# 📄 PDF Generation API Views – REQUIRE API KEY
# ============================================================

class PDFTemplateListView(APIView):
    """
    List all available PDF templates (for external apps).
    Requires valid API key in X-API-Key header.
    """
    permission_classes = [HasValidAPIKey]

    def get(self, request):
        templates = PDFTemplate.objects.filter(is_active=True)
        serializer = PDFTemplateSerializer(templates, many=True)
        return Response(serializer.data)


class PDFGenerateView(APIView):
    """
    Generate a PDF from a template or custom HTML.

    POST /api/pdf/generate/
    Headers: X-API-Key: your-secret-key

    Request Body:
    {
        "template_slug": "invoice",      # Optional: use stored template
        "html": "<h1>Hello {{ name }}</h1>",  # Optional: custom HTML
        "context": {"name": "John"},      # Data for template rendering
        "css": "body { color: red; }",    # Optional custom CSS
        "filename": "document.pdf",       # Optional
        "async_mode": false               # Optional: process in background
    }
    """
    permission_classes = [HasValidAPIKey]

    def post(self, request):
        serializer = PDFGenerateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        template_slug = data.get('template_slug')
        html = data.get('html')
        context = data.get('context', {})
        css = data.get('css', '')
        filename = data.get('filename', 'document.pdf')
        async_mode = data.get('async_mode', False)

        # Get template if slug provided
        template = None
        if template_slug:
            try:
                template = PDFTemplate.objects.get(slug=template_slug, is_active=True)
            except PDFTemplate.DoesNotExist:
                return Response(
                    {'error': f'Template with slug "{template_slug}" not found'},
                    status=status.HTTP_404_NOT_FOUND
                )

        # Track the export
        export = PDFExport.objects.create(
            template=template,
            context_data=context,
            status='pending',
            api_key_used=request.api_key_name if hasattr(request, 'api_key_name') else 'unknown'
        )

        # TODO: Add Celery async support
        if async_mode:
            return Response({
                'status': 'processing',
                'export_id': export.id,
                'message': 'PDF generation queued. Check /api/pdf/status/{id}/'
            }, status=status.HTTP_202_ACCEPTED)

        try:
            # Generate the PDF
            if template:
                pdf_bytes = PDFService.generate_from_template(template, context)
            elif html:
                pdf_bytes = PDFService.render_html_to_pdf(html, context, css)
            else:
                return Response(
                    {'error': 'Either template_slug or html is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Update export record
            export.status = 'completed'
            export.completed_at = timezone.now()
            export.save()

            # Return the PDF
            response = FileResponse(io.BytesIO(pdf_bytes), content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
            response['X-Export-ID'] = str(export.id)
            return response

        except Exception as e:
            export.status = 'failed'
            export.error_message = str(e)
            export.save()
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PDFStatusView(APIView):
    """
    Check the status of an async PDF generation job.
    Requires valid API key.
    """
    permission_classes = [HasValidAPIKey]

    def get(self, request, export_id):
        export = get_object_or_404(PDFExport, id=export_id)
        serializer = PDFExportSerializer(export)
        return Response(serializer.data)
