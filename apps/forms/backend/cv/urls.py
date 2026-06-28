from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ResumeViewSet, JobApplicationViewSet, react_demo_view

router = DefaultRouter()
router.register(r'resumes', ResumeViewSet, basename='resume-api')
router.register(r'applications', JobApplicationViewSet, basename='application-api')

urlpatterns = [
    # Optional: React demo view (if you still need it)
    path('', react_demo_view, name='react_demo'),

    # API endpoints under /api/
    path('api/', include(router.urls)),
]
