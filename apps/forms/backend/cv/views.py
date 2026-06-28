import pdfkit
from django.shortcuts import render
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.utils import timezone
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from .models import Resume, JobApplication
from .serializers import ResumeSerializer, JobApplicationSerializer

# Optional: keep this if you need the React demo page
def react_demo_view(request):
    return render(request, 'resumesite/react_demo.html')

class ResumeViewSet(viewsets.ModelViewSet):
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer
    permission_classes = [AllowAny]

    @action(detail=True, methods=['get'], url_path='pdf')
    def download_pdf(self, request, pk=None):
        """Generate and download a PDF version of the resume."""
        resume = self.get_object()

        # Helper: split comma-separated strings into lists
        def split_list(value):
            if value:
                return [item.strip() for item in value.split(',') if item.strip()]
            return []

        skills = split_list(resume.skills)
        languages = split_list(resume.languages)
        achievements = split_list(resume.achievements)

        education_list = [resume.education1]
        if resume.education2:
            education_list.append(resume.education2)
        if resume.education3:
            education_list.append(resume.education3)

        project_list = [resume.project1]
        if resume.project2:
            project_list.append(resume.project2)

        experience_list = [resume.experience1]
        if resume.experience2:
            experience_list.append(resume.experience2)

        context = {
            'resume': resume,
            'skills': skills,
            'languages': languages,
            'achievements': achievements,
            'education_list': education_list,
            'project_list': project_list,
            'experience_list': experience_list,
            'now': timezone.now(),
        }

        # Render HTML template
        html = render_to_string('cv/pdf_template.html', context)

        # PDF options
        options = {
            'page-size': 'A4',
            'margin-top': '0.75in',
            'margin-right': '0.75in',
            'margin-bottom': '0.75in',
            'margin-left': '0.75in',
            'encoding': "UTF-8",
            'no-outline': None,
        }

        try:
            pdf = pdfkit.from_string(html, False, options=options)
            response = HttpResponse(pdf, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="CV_{resume.full_name}.pdf"'
            return response
        except Exception as e:
            return HttpResponse(f"Error generating PDF: {e}", status=500)

class JobApplicationViewSet(viewsets.ModelViewSet):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer
    permission_classes = [AllowAny]
