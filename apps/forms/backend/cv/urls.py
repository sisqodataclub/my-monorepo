from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ResumeViewSet, JobApplicationViewSet, react_demo_view
from .auth_views import HVTLoginView, HVTRegisterView, HVTMeView

router = DefaultRouter()
router.register(r'resumes', ResumeViewSet, basename='resume-api')
router.register(r'applications', JobApplicationViewSet, basename='application-api')

urlpatterns = [
    # React demo view (optional)
    path('', react_demo_view, name='react_demo'),

    # CV API endpoints
    path('api/', include(router.urls)),

    # 🔐 HVT Authentication Proxy Endpoints
    path('api/auth/login/', HVTLoginView.as_view(), name='hvt_login'),
    path('api/auth/register/', HVTRegisterView.as_view(), name='hvt_register'),
    path('api/auth/me/', HVTMeView.as_view(), name='hvt_me'),
]
