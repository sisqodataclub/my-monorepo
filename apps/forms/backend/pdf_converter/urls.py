# pdf_converter/urls.py
from django.urls import path
from . import api_views

app_name = 'pdf_converter'

urlpatterns = [
    # ============================================================
    # 🔐 Authentication API Routes (public)
    # ============================================================
    path('api/request-login/', api_views.RequestLoginView.as_view(), name='api_request_login'),
    path('api/verify-login/', api_views.VerifyLoginView.as_view(), name='api_verify_login'),
    path('api/logout/', api_views.LogoutView.as_view(), name='api_logout'),

    # ============================================================
    # 👤 User API Routes (requires API key)
    # ============================================================
    path('api/user/info/', api_views.UserInfoView.as_view(), name='api_user_info'),

    # ============================================================
    # 📄 PDF Generation API Routes (requires API key)
    # ============================================================
    path('api/pdf/templates/', api_views.PDFTemplateListView.as_view(), name='api_template_list'),
    path('api/pdf/generate/', api_views.PDFGenerateView.as_view(), name='api_generate'),
    path('api/pdf/status/<int:export_id>/', api_views.PDFStatusView.as_view(), name='api_status'),

    # ============================================================
    # 📤 File Upload API Route (requires API key)
    # ============================================================
    path('api/pdf/upload/', api_views.PDFUploadView.as_view(), name='api_upload'),
]
