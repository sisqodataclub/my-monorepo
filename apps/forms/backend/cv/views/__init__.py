# cv/views/__init__.py

from .cv_views import (
    react_demo_view,
    ResumeViewSet,
    JobApplicationViewSet,
    # ---- New Profile Library ViewSets ----
    ProfileEducationViewSet,
    ProfileExperienceViewSet,
    ProfileProjectViewSet,
    ProfileSkillViewSet,
    ProfileLanguageViewSet,
    ProfileAchievementViewSet,
)
from .ai_views import (
    analyze_cv,
    stream_mission,
    fetch_cv_report,
)

# Optional: Expose all public names
__all__ = [
    'react_demo_view',
    'ResumeViewSet',
    'JobApplicationViewSet',
    'ProfileEducationViewSet',
    'ProfileExperienceViewSet',
    'ProfileProjectViewSet',
    'ProfileSkillViewSet',
    'ProfileLanguageViewSet',
    'ProfileAchievementViewSet',
    'analyze_cv',
    'stream_mission',
    'fetch_cv_report',
]
