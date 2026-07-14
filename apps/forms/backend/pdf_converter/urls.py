# this is df_converter/urls.py
from django.urls import path
from . import api_views

app_name = 'pdf_converter'

urlpatterns = [
    # ============================================================
    # 🔐 Authentication API Routes (for React)
    # ============================================================
    path('api/request-login/', api_views.RequestLoginView.as_view(), name='api_request_login'),
    path('api/verify-login/', api_views.VerifyLoginView.as_view(), name='api_verify_login'),
    path('api/logout/', api_views.LogoutView.as_view(), name='api_logout'),

    # ============================================================
    # 📄 PDF Generation API Routes (for External Apps)
    # ============================================================
    path('api/pdf/templates/', api_views.PDFTemplateListView.as_view(), name='api_template_list'),
    path('api/pdf/generate/', api_views.PDFGenerateView.as_view(), name='api_generate'),
    path('api/pdf/status/<int:export_id>/', api_views.PDFStatusView.as_view(), name='api_status'),
]
