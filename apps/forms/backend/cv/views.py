import pdfkit
import markdown
from django.shortcuts import render
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.utils import timezone
from django.utils.safestring import mark_safe
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from .models import Resume, JobApplication
from .serializers import ResumeSerializer, JobApplicationSerializer

# Optional: keep this if you need the React demo page
def react_demo_view(request):
    return render(request, 'resumesite/react_demo.html')

class ResumeViewSet(viewsets.ModelViewSet):
    serializer_class = ResumeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return only resumes belonging to the authenticated user."""
        return Resume.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Automatically set the user when creating a resume."""
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['get'], url_path='pdf')
    def download_pdf(self, request, pk=None):
        """Generate and download a PDF version of the resume with Markdown support."""
        resume = self.get_object()

        # Helper to convert Markdown to HTML
        def render_markdown(text):
            if not text:
                return ''
            # Convert Markdown to HTML with extensions for lists, tables, and line breaks
            html = markdown.markdown(text, extensions=['extra', 'nl2br'])
            return mark_safe(html)

        # Fetch related data
        educations = resume.educations.all().order_by('order', '-start_date')
        experiences = resume.experiences.all().order_by('order', '-start_date')
        projects = resume.projects.all().order_by('order', '-start_date')
        skills = resume.skills.all()
        languages = resume.languages.all()
        achievements = resume.achievements.all()

        context = {
            'resume': resume,
            'educations': educations,
            'experiences': experiences,
            'projects': projects,
            'skills': skills,
            'languages': languages,
            'achievements': achievements,
            'render_markdown': render_markdown,  # Pass function to template
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
            # Use title or full_name for filename
            filename = f"CV_{resume.title or resume.full_name}.pdf"
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
            return response
        except Exception as e:
            return HttpResponse(f"Error generating PDF: {e}", status=500)


class JobApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return only applications belonging to the authenticated user."""
        return JobApplication.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Automatically set the user when creating a job application."""
        serializer.save(user=self.request.user)
