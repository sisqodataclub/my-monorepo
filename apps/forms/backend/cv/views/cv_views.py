# cv/views/cv_views.py
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
from ..models import Resume, JobApplication
from ..serializers import ResumeSerializer, JobApplicationSerializer

def react_demo_view(request):
    return render(request, 'resumesite/react_demo.html')


class ResumeViewSet(viewsets.ModelViewSet):
    serializer_class = ResumeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['get'], url_path='pdf')
    def download_pdf(self, request, pk=None):
        resume = self.get_object()

        def render_markdown(text):
            if not text:
                return ''
            html = markdown.markdown(text, extensions=['extra', 'nl2br'])
            return mark_safe(html)

        educations = resume.educations.all().order_by('order', '-start_date')
        experiences = resume.experiences.all().order_by('order', '-start_date')
        projects = resume.projects.all().order_by('order', '-start_date')
        skills = resume.skills.all()
        languages = resume.languages.all()
        achievements = resume.achievements.all()

        resume.about_html = render_markdown(resume.about)
        for edu in educations:
            edu.description_html = render_markdown(edu.description)
        for exp in experiences:
            exp.description_html = render_markdown(exp.description)
        for proj in projects:
            proj.description_html = render_markdown(proj.description)
        for ach in achievements:
            ach.description_html = render_markdown(ach.description)

        context = {
            'resume': resume,
            'educations': educations,
            'experiences': experiences,
            'projects': projects,
            'skills': skills,
            'languages': languages,
            'achievements': achievements,
            'now': timezone.now(),
        }

        html = render_to_string('cv/pdf_template.html', context)
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
            filename = f"CV_{resume.title or resume.full_name}.pdf"
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
            return response
        except Exception as e:
            return HttpResponse(f"Error generating PDF: {e}", status=500)


class JobApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = JobApplication.objects.filter(user=self.request.user)
        tag = self.request.query_params.get('tag')
        if tag:
            queryset = queryset.filter(tags__name__iexact=tag)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
