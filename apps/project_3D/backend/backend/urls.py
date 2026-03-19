from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.views.generic import TemplateView
from django.urls import re_path
from api.views import contact_view




from api.admin import dashboard_admin_site

urlpatterns = [
    path("admin/", admin.site.urls),
    path("dashboard-admin/", dashboard_admin_site.urls),
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),
    path("api/", include("api.urls")),

    
    path("api/contact/", contact_view, name="contact"),
    # 🔁 Catch-all for React
   # re_path(r"^(?:.*)/?$", TemplateView.as_view(template_name="index.html")),
]


