from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ResumeViewSet,
    JobApplicationViewSet,
    react_demo_view,
    analyze_cv,
    stream_mission,
    fetch_cv_report,          # <-- new AI view for fetching the final report
)
from .auth_views import HVTLoginView, HVTRegisterView, HVTMeView

router = DefaultRouter()
router.register(r'resumes', ResumeViewSet, basename='resume-api')
router.register(r'applications', JobApplicationViewSet, basename='application-api')

urlpatterns = [
    # React demo view
    path('', react_demo_view, name='react_demo'),

    # CV API endpoints
    path('api/', include(router.urls)),

    # 🔐 HVT Authentication Proxy Endpoints
    path('api/auth/login/', HVTLoginView.as_view(), name='hvt_login'),
    path('api/auth/register/', HVTRegisterView.as_view(), name='hvt_register'),
    path('api/auth/me/', HVTMeView.as_view(), name='hvt_me'),

    # 🤖 AI Endpoints (Empire Orchestrator)
    path('api/ai/analyze-cv/', analyze_cv, name='analyze_cv'),
    path('api/ai/stream/<str:task_id>/', stream_mission, name='stream_mission'),
    path('api/ai/report/<str:task_id>/', fetch_cv_report, name='fetch_cv_report'),
]
