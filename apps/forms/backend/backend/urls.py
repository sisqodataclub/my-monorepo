from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from api.admin import dashboard_admin_site

urlpatterns = [
    path("admin/", admin.site.urls),
    path("dashboard-admin/", dashboard_admin_site.urls),

    # User Registration
    path("api/user/register/", CreateUserView.as_view(), name="register"),

    # JWT Authentication Endpoints
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),

    # Standard DRF Auth (Session-based, good for browsable API)
    path("api-auth/", include("rest_framework.urls")),

    # Main API routes (forms: contact, blogs, etc.)
    path("api/", include("api.urls")),

    # ==========================================
    # NEW: CV app (resumes + job applications)
    # ==========================================
    path("cv/", include("cv.urls")),   # <-- ADD THIS LINE
]
