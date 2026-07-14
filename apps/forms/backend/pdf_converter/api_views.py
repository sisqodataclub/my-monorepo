# pdf_converter/api_views.py
import io
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.http import FileResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .auth_service import AuthService
from .models import PDFUser, EmailLoginCode, PDFTemplate, PDFExport
from .serializers import PDFTemplateSerializer, PDFExportSerializer, PDFGenerateSerializer
from .services import PDFService
from .permissions import HasValidAPIKey


# ============================================================
# 🔐 Authentication API Views – PUBLIC (no API key required)
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
        # Mark as used
        login_code.is_used = True
        login_code.save()

        pdf_user = login_code.pdf_user

        # 🆕 Return the user info AND their API key!
        return Response({
            'success': True,
            'message': 'Successfully logged in!',
            'user': {
                'id': pdf_user.id,
                'email': pdf_user.email,
                'api_key': pdf_user.api_key,  # React can store this
            }
        }, status=status.HTTP_200_OK)


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Since we don't use sessions, just return success.
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

        # Get the PDFUser from the API key (stored in request by HasValidAPIKey)
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
