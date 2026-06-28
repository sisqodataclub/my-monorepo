from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Resume, JobApplication
from .serializers import ResumeSerializer, JobApplicationSerializer

# Optional: keep this if you need the React demo page
def react_demo_view(request):
    return render(request, 'resumesite/react_demo.html')

class ResumeViewSet(viewsets.ModelViewSet):
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer
    permission_classes = [AllowAny]

class JobApplicationViewSet(viewsets.ModelViewSet):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer
    permission_classes = [AllowAny]
