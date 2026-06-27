# resumesite/urls.py

from django.urls import path, include
from . import views
from django.views.generic import TemplateView
from django.contrib.auth import views as auth_views
from rest_framework.routers import DefaultRouter

# Initialize DRF Router
router = DefaultRouter()
# Register both viewsets
router.register(r'resumes', views.ResumeViewSet, basename='resume-api')
router.register(r'applications', views.JobApplicationViewSet, basename='application-api')

urlpatterns = [
    # React demo (optional)
    path('', views.react_demo_view, name='react_demo'),

    # API endpoints under /api/
    path('api/', include(router.urls)),

    # Web CRUD views (no authentication required now)
    path('resume/create/', views.create_resume, name='resume_create'),
    path('resume/<int:resume_id>/', views.resume_detail, name='resume_detail'),
    path('resume/<int:resume_id>/edit/', views.edit_resume, name='resume_edit'),
    path('resume/<int:resume_id>/delete/', views.delete_resume, name='resume_delete'),

    # Class‑based view (alternative detail)
    path('resume-cbv/<int:pk>/', views.ResumeDetailView.as_view(), name='resume_detail_cbv'),

    # Authentication (optional, kept for possible future use)
    path('register/', views.register, name='register'),
    path('logout/', auth_views.LogoutView.as_view(template_name='registration/logged_out.html'), name='logout'),
]

