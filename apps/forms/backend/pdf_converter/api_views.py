# pdf_converter/api_views.py
import io
import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.http import FileResponse
from django.shortcuts import get_object_or_404
from django.contrib.auth import login
from django.utils import timezone
from django.core.files.uploadedfile import InMemoryUploadedFile
from .auth_service import AuthService
from .models import PDFUser, EmailLoginCode, PDFTemplate, PDFExport
from .serializers import PDFTemplateSerializer, PDFExportSerializer, PDFGenerateSerializer
from .services import PDFService
from .permissions import HasValidAPIKey


# ============================================================
# 🔐 Authentication API Views – PUBLIC
# ============================================================

class RequestLoginView(APIView):
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
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class VerifyLoginView(APIView):
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
        login_code.is_used = True
        login_code.save()

        pdf_user = login_code.pdf_user
        return Response({
            'success': True,
            'message': 'Successfully logged in!',
            'user': {
                'id': pdf_user.id,
                'email': pdf_user.email,
                'api_key': pdf_user.api_key,
            }
        }, status=status.HTTP_200_OK)


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        return Response({'success': True, 'message': 'Logged out successfully'})


# ============================================================
# 📄 PDF Generation API Views – REQUIRE API KEY
# ============================================================

class PDFTemplateListView(APIView):
    permission_classes = [HasValidAPIKey]

    def get(self, request):
        templates = PDFTemplate.objects.filter(is_active=True)
        serializer = PDFTemplateSerializer(templates, many=True)
        return Response(serializer.data)


class PDFGenerateView(APIView):
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

        template = None
        if template_slug:
            try:
                template = PDFTemplate.objects.get(slug=template_slug, is_active=True)
            except PDFTemplate.DoesNotExist:
                return Response(
                    {'error': f'Template with slug "{template_slug}" not found'},
                    status=status.HTTP_404_NOT_FOUND
                )

        pdf_user = getattr(request, 'pdf_user', None)

        export = PDFExport.objects.create(
            template=template,
            pdf_user=pdf_user,
            context_data=context,
            status='pending',
            api_key_used=request.api_key_name if hasattr(request, 'api_key_name') else 'unknown'
        )

        if async_mode:
            return Response({
                'status': 'processing',
                'export_id': export.id,
                'message': 'PDF generation queued. Check /api/pdf/status/{id}/'
            }, status=status.HTTP_202_ACCEPTED)

        try:
            if template:
                pdf_bytes = PDFService.generate_from_template(template, context)
            elif html:
                pdf_bytes = PDFService.render_html_to_pdf(html, context, css)
            else:
                return Response(
                    {'error': 'Either template_slug or html is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            export.status = 'completed'
            export.completed_at = timezone.now()
            export.save()

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
    permission_classes = [HasValidAPIKey]

    def get(self, request, export_id):
        export = get_object_or_404(PDFExport, id=export_id)
        serializer = PDFExportSerializer(export)
        return Response(serializer.data)


# ============================================================
# 🆕 File Upload API View
# ============================================================

class PDFUploadView(APIView):
    """
    Upload a document (docx, md, txt, html) and convert it to PDF.

    POST /api/pdf/upload/
    Headers: X-API-Key: your-secret-key
    Request: multipart/form-data with file field named 'document'
    """
    permission_classes = [HasValidAPIKey]

    def post(self, request):
        uploaded_file: InMemoryUploadedFile = request.FILES.get('document')
        if not uploaded_file:
            return Response(
                {'error': 'No file uploaded. Please provide a document.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if uploaded_file.size > 10 * 1024 * 1024:
            return Response(
                {'error': 'File size exceeds 10MB limit.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        filename = uploaded_file.name
        file_extension = os.path.splitext(filename)[1].lower()

        allowed_extensions = ['.docx', '.doc', '.md', '.markdown', '.txt', '.text', '.html', '.htm']
        if file_extension not in allowed_extensions:
            return Response({
                'error': f'Unsupported file type: {file_extension}. Supported: {", ".join(allowed_extensions)}'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            file_bytes = uploaded_file.read()
            html_content = PDFService.convert_file_to_html(file_bytes, file_extension)

            pdf_filename = os.path.splitext(filename)[0] + '.pdf'
            pdf_bytes = PDFService.render_html_to_pdf(html_content, context={})

            response = FileResponse(io.BytesIO(pdf_bytes), content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="{pdf_filename}"'
            return response

        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': f'Failed to convert document: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
