# cv/apps.py
from django.apps import AppConfig

class CvConfig(AppConfig):  # optional: rename the class
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'cv'  # important: must match the app's folder name
