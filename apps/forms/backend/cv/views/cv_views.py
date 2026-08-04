# cv/views/cv_views.py

import pdfkit
import markdown
from django.shortcuts import render
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.utils import timezone
from django.utils.safestring import mark_safe
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response

# Legacy models & serializers
from ..models import (
    Resume, JobApplication,
    ProfileEducation, ProfileExperience, ProfileProject,
    ProfileSkill, ProfileLanguage, ProfileAchievement
)
from ..serializers import (
    ResumeSerializer, JobApplicationSerializer,
    ProfileEducationSerializer, ProfileExperienceSerializer,
    ProfileProjectSerializer, ProfileSkillSerializer,
    ProfileLanguageSerializer, ProfileAchievementSerializer
)


def react_demo_view(request):
    return render(request, 'resumesite/react_demo.html')


# ----------------------------------------------------------------------
# Resume ViewSet (modified PDF generation to use profile library)
# ----------------------------------------------------------------------

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

        # ---- Resolve sections using the new profile library ----
        if resume.profile_education_ids:
            educations = ProfileEducation.objects.filter(
                id__in=resume.profile_education_ids
            ).order_by('-start_date')
        else:
            educations = resume.educations.all().order_by('order', '-start_date')

        if resume.profile_experience_ids:
            experiences = ProfileExperience.objects.filter(
                id__in=resume.profile_experience_ids
            ).order_by('-start_date')
        else:
            experiences = resume.experiences.all().order_by('order', '-start_date')

        if resume.profile_project_ids:
            projects = ProfileProject.objects.filter(
                id__in=resume.profile_project_ids
            ).order_by('-start_date')
        else:
            projects = resume.projects.all().order_by('order', '-start_date')

        if resume.profile_skill_ids:
            skills = ProfileSkill.objects.filter(id__in=resume.profile_skill_ids)
        else:
            skills = resume.skills.all()

        if resume.profile_language_ids:
            languages = ProfileLanguage.objects.filter(id__in=resume.profile_language_ids)
        else:
            languages = resume.languages.all()

        if resume.profile_achievement_ids:
            achievements = ProfileAchievement.objects.filter(id__in=resume.profile_achievement_ids)
        else:
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


# ----------------------------------------------------------------------
# JobApplication ViewSet (unchanged)
# ----------------------------------------------------------------------

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


# ----------------------------------------------------------------------
# NEW Profile Library ViewSets (with "get or create" deduplication)
# ----------------------------------------------------------------------

class ProfileEducationViewSet(viewsets.ModelViewSet):
    serializer_class = ProfileEducationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ProfileEducation.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Set the user automatically when creating."""
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        """
        Get or create: if an education with same institution+degree+field exists,
        return that (and optionally update it); otherwise create a new one.
        """
        user = request.user
        institution = request.data.get('institution')
        degree = request.data.get('degree', '')
        field_of_study = request.data.get('field_of_study', '')

        if not institution:
            return Response(
                {'error': 'institution is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        existing = ProfileEducation.objects.filter(
            user=user,
            institution=institution,
            degree=degree,
            field_of_study=field_of_study
        ).first()

        if existing:
            serializer = self.get_serializer(existing, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)   # now sets user
            return Response(serializer.data, status=status.HTTP_201_CREATED)


class ProfileExperienceViewSet(viewsets.ModelViewSet):
    serializer_class = ProfileExperienceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ProfileExperience.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        """Get or create: dedupe on (company, position)."""
        user = request.user
        company = request.data.get('company')
        position = request.data.get('position', '')

        if not company:
            return Response(
                {'error': 'company is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        existing = ProfileExperience.objects.filter(
            user=user,
            company=company,
            position=position
        ).first()

        if existing:
            serializer = self.get_serializer(existing, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)


class ProfileProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProfileProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ProfileProject.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        """Get or create: dedupe on (name)."""
        user = request.user
        name = request.data.get('name')

        if not name:
            return Response(
                {'error': 'name is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        existing = ProfileProject.objects.filter(
            user=user,
            name=name
        ).first()

        if existing:
            serializer = self.get_serializer(existing, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)


class ProfileSkillViewSet(viewsets.ModelViewSet):
    serializer_class = ProfileSkillSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ProfileSkill.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        """Get or create: dedupe on (name)."""
        user = request.user
        name = request.data.get('name')

        if not name:
            return Response(
                {'error': 'name is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        existing = ProfileSkill.objects.filter(
            user=user,
            name=name
        ).first()

        if existing:
            serializer = self.get_serializer(existing, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)


class ProfileLanguageViewSet(viewsets.ModelViewSet):
    serializer_class = ProfileLanguageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ProfileLanguage.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        """Get or create: dedupe on (name)."""
        user = request.user
        name = request.data.get('name')

        if not name:
            return Response(
                {'error': 'name is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        existing = ProfileLanguage.objects.filter(
            user=user,
            name=name
        ).first()

        if existing:
            serializer = self.get_serializer(existing, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)


class ProfileAchievementViewSet(viewsets.ModelViewSet):
    serializer_class = ProfileAchievementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ProfileAchievement.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        """Get or create: dedupe on (description) (exact match)."""
        user = request.user
        description = request.data.get('description')

        if not description:
            return Response(
                {'error': 'description is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        existing = ProfileAchievement.objects.filter(
            user=user,
            description=description
        ).first()

        if existing:
            serializer = self.get_serializer(existing)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
