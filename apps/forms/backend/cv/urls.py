# backend/cv/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ResumeViewSet,
    JobApplicationViewSet,
    # New profile viewSets
    ProfileEducationViewSet,
    ProfileExperienceViewSet,
    ProfileProjectViewSet,
    ProfileSkillViewSet,
    ProfileLanguageViewSet,
    ProfileAchievementViewSet,
    # Other views
    react_demo_view,
    analyze_cv,
    stream_mission,
    fetch_cv_report,
)
from .auth_views import HVTLoginView, HVTRegisterView, HVTMeView

# ============================================================================
# REST Framework Router
# ============================================================================

router = DefaultRouter()

# ---- Core CV endpoints ----
router.register(r'resumes', ResumeViewSet, basename='resume-api')
router.register(r'applications', JobApplicationViewSet, basename='application-api')

# ---- New Profile Library endpoints ----
router.register(r'profile/educations', ProfileEducationViewSet, basename='profile-education')
router.register(r'profile/experiences', ProfileExperienceViewSet, basename='profile-experience')
router.register(r'profile/projects', ProfileProjectViewSet, basename='profile-project')
router.register(r'profile/skills', ProfileSkillViewSet, basename='profile-skill')
router.register(r'profile/languages', ProfileLanguageViewSet, basename='profile-language')
router.register(r'profile/achievements', ProfileAchievementViewSet, basename='profile-achievement')


# ============================================================================
# URL Patterns
# ============================================================================

urlpatterns = [
    # ---- React demo view ----
    path('', react_demo_view, name='react_demo'),

    # ---- API endpoints ----
    path('api/', include(router.urls)),

    # ---- Authentication (HVT proxy) ----
    path('api/auth/login/', HVTLoginView.as_view(), name='hvt_login'),
    path('api/auth/register/', HVTRegisterView.as_view(), name='hvt_register'),
    path('api/auth/me/', HVTMeView.as_view(), name='hvt_me'),

    # ---- AI endpoints (Empire Orchestrator) ----
    path('api/ai/analyze-cv/', analyze_cv, name='analyze_cv'),
    path('api/ai/stream/<str:task_id>/', stream_mission, name='stream_mission'),
    path('api/ai/report/<str:task_id>/', fetch_cv_report, name='fetch_cv_report'),
]
