# backend/cv/models.py

from django.db import models
from django.conf import settings
from django.utils import timezone


class Resume(models.Model):
    """
    A CV/resume belonging to a user.
    Now uses profile library IDs to reference reusable sections.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='resumes'
    )
    title = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        help_text="Optional CV title (e.g., 'Data Analyst CV')"
    )
    full_name = models.CharField(max_length=100)
    about = models.TextField()
    age = models.IntegerField(null=True, blank=True)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    section_order = models.JSONField(default=list, blank=True)

    # ---- New: references to global profile sections ----
    profile_education_ids = models.JSONField(
        default=list, blank=True,
        help_text="List of ProfileEducation IDs (ordered)"
    )
    profile_experience_ids = models.JSONField(
        default=list, blank=True,
        help_text="List of ProfileExperience IDs (ordered)"
    )
    profile_project_ids = models.JSONField(
        default=list, blank=True,
        help_text="List of ProfileProject IDs (ordered)"
    )
    profile_skill_ids = models.JSONField(
        default=list, blank=True,
        help_text="List of ProfileSkill IDs (ordered)"
    )
    profile_language_ids = models.JSONField(
        default=list, blank=True,
        help_text="List of ProfileLanguage IDs (ordered)"
    )
    profile_achievement_ids = models.JSONField(
        default=list, blank=True,
        help_text="List of ProfileAchievement IDs (ordered)"
    )

    def __str__(self):
        return self.title or self.full_name


# ----------------------------------------------------------------------
# Legacy nested models (kept for backward compatibility)
# ----------------------------------------------------------------------

class Education(models.Model):
    """Legacy education – kept for old resumes. New ones should use ProfileEducation."""
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='educations')
    institution = models.CharField(max_length=200)
    degree = models.CharField(max_length=100, blank=True)
    field_of_study = models.CharField(max_length=100, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', '-start_date']

    def __str__(self):
        return f"{self.degree} at {self.institution}"


class Experience(models.Model):
    """Legacy experience – kept for old resumes."""
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='experiences')
    company = models.CharField(max_length=200)
    position = models.CharField(max_length=200, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    is_current = models.BooleanField(default=False)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', '-start_date']

    def __str__(self):
        return f"{self.position} at {self.company}"


class Project(models.Model):
    """Legacy project – kept for old resumes."""
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='projects')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    url = models.URLField(blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', '-start_date']

    def __str__(self):
        return self.name


class Skill(models.Model):
    """Legacy skill – kept for old resumes."""
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='skills')
    name = models.CharField(max_length=1000)
    proficiency = models.CharField(max_length=500, blank=True)

    def __str__(self):
        return self.name


class Language(models.Model):
    """Legacy language – kept for old resumes."""
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='languages')
    name = models.CharField(max_length=50)
    proficiency = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return self.name


class Achievement(models.Model):
    """Legacy achievement – kept for old resumes."""
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='achievements')
    description = models.TextField()

    def __str__(self):
        return self.description[:50]


# ----------------------------------------------------------------------
# New global profile models (reusable across many resumes)
# ----------------------------------------------------------------------

class ProfileEducation(models.Model):
    """
    Global education entry owned by the user.
    Reusable across multiple CVs.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile_educations'
    )
    institution = models.CharField(max_length=200)
    degree = models.CharField(max_length=100, blank=True)
    field_of_study = models.CharField(max_length=100, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-start_date', 'institution']
        unique_together = [['user', 'institution', 'degree', 'field_of_study']]

    def __str__(self):
        return f"{self.degree} at {self.institution}"


class ProfileExperience(models.Model):
    """
    Global work experience owned by the user.
    Reusable across multiple CVs.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile_experiences'
    )
    company = models.CharField(max_length=200)
    position = models.CharField(max_length=200, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    is_current = models.BooleanField(default=False)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-start_date', 'company']
        unique_together = [['user', 'company', 'position']]

    def __str__(self):
        return f"{self.position} at {self.company}"


class ProfileProject(models.Model):
    """
    Global project owned by the user.
    Reusable across multiple CVs.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile_projects'
    )
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    url = models.URLField(blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-start_date', 'name']
        unique_together = [['user', 'name']]

    def __str__(self):
        return self.name


class ProfileSkill(models.Model):
    """
    Global skill owned by the user.
    Reusable across multiple CVs.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile_skills'
    )
    name = models.CharField(max_length=100)
    proficiency = models.CharField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = [['user', 'name']]

    def __str__(self):
        return self.name


class ProfileLanguage(models.Model):
    """
    Global language owned by the user.
    Reusable across multiple CVs.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile_languages'
    )
    name = models.CharField(max_length=50)
    proficiency = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = [['user', 'name']]

    def __str__(self):
        return self.name


class ProfileAchievement(models.Model):
    """
    Global achievement owned by the user.
    Reusable across multiple CVs.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile_achievements'
    )
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.description[:50]


# ----------------------------------------------------------------------
# Tags and JobApplication (unchanged)
# ----------------------------------------------------------------------

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class JobApplication(models.Model):
    STATUS_CHOICES = [
        ('saved', 'Saved'),
        ('applied', 'Applied'),
        ('follow_up', 'Follow-up'),
        ('interviewing', 'Interviewing'),
        ('offered', 'Offered'),
        ('rejected', 'Rejected'),
    ]

    STAGE_CHOICES = [
        (0, 'Saved'),
        (1, 'Applied'),
        (2, 'Follow-up'),
        (3, 'Interviewing'),
        (4, 'Offered'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='applications'
    )
    job_link = models.URLField()
    company = models.CharField(max_length=200)
    position = models.CharField(max_length=200)
    date_applied = models.DateField(null=True, blank=True)
    deadline_date = models.DateField(null=True, blank=True, help_text="Application deadline")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='saved')
    resume_used = models.ForeignKey(
        Resume,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='applications'
    )
    notes = models.TextField(blank=True)
    tags = models.ManyToManyField(Tag, blank=True, related_name='applications')
    status_updated_at = models.DateTimeField(auto_now=True)
    highest_stage_reached = models.IntegerField(
        choices=STAGE_CHOICES,
        default=0,
        help_text="Highest stage ever reached"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        name = self.user.get_full_name() or self.user.email or "User"
        return f"{name} - {self.position} at {self.company}"

    def save(self, *args, **kwargs):
        stage_map = {
            'saved': 0,
            'applied': 1,
            'follow_up': 2,
            'interviewing': 3,
            'offered': 4,
            'rejected': 0,
        }
        current_stage = stage_map.get(self.status, 0)
        if self.pk:
            old = JobApplication.objects.get(pk=self.pk)
            old_stage = stage_map.get(old.status, 0)
            if current_stage > old_stage and current_stage > self.highest_stage_reached:
                self.highest_stage_reached = current_stage
        else:
            if current_stage > self.highest_stage_reached:
                self.highest_stage_reached = current_stage
        super().save(*args, **kwargs)
