# backend/cv/admin.py

from django.contrib import admin
from .models import (
    # Legacy models
    Resume, Education, Experience, Project,
    Skill, Language, Achievement,
    # New profile models
    ProfileEducation, ProfileExperience, ProfileProject,
    ProfileSkill, ProfileLanguage, ProfileAchievement,
    # Others
    JobApplication, Tag
)

# ============================================================================
# LEGACY INLINES (for old resumes — kept for backward compatibility)
# ============================================================================

class EducationInline(admin.TabularInline):
    model = Education
    extra = 1
    fields = ['institution', 'degree', 'field_of_study', 'start_date', 'end_date', 'description', 'order']
    ordering = ['order', '-start_date']

class ExperienceInline(admin.TabularInline):
    model = Experience
    extra = 1
    fields = ['company', 'position', 'start_date', 'end_date', 'description', 'location', 'order']
    ordering = ['order', '-start_date']

class ProjectInline(admin.TabularInline):
    model = Project
    extra = 1
    fields = ['name', 'description', 'url', 'start_date', 'end_date', 'order']
    ordering = ['order', '-start_date']

class SkillInline(admin.TabularInline):
    model = Skill
    extra = 1
    fields = ['name', 'proficiency']

class LanguageInline(admin.TabularInline):
    model = Language
    extra = 1
    fields = ['name', 'proficiency']

class AchievementInline(admin.TabularInline):
    model = Achievement
    extra = 1
    fields = ['description']


# ============================================================================
# NEW PROFILE INLINES (read-only, for viewing linked sections)
# ============================================================================

class ProfileEducationInline(admin.TabularInline):
    model = ProfileEducation
    extra = 0
    fields = ['institution', 'degree', 'field_of_study', 'start_date', 'end_date']
    readonly_fields = fields
    can_delete = False
    max_num = 0  # no add/edit via inline
    verbose_name = "Linked Profile Education"
    verbose_name_plural = "Linked Profile Educations"

    def has_add_permission(self, request, obj=None):
        return False

class ProfileExperienceInline(admin.TabularInline):
    model = ProfileExperience
    extra = 0
    fields = ['company', 'position', 'start_date', 'end_date', 'location']
    readonly_fields = fields
    can_delete = False
    max_num = 0
    verbose_name = "Linked Profile Experience"
    verbose_name_plural = "Linked Profile Experiences"

    def has_add_permission(self, request, obj=None):
        return False


# ============================================================================
# RESUME ADMIN (updated to show both legacy and new fields)
# ============================================================================

@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ('title', 'full_name', 'email', 'phone', 'user', 'created_at')
    search_fields = ('title', 'full_name', 'email', 'user__email')
    list_filter = ('created_at',)
    raw_id_fields = ('user',)

    # Keep legacy inlines for viewing old nested data
    inlines = [
        EducationInline,
        ExperienceInline,
        ProjectInline,
        SkillInline,
        LanguageInline,
        AchievementInline,
    ]

    # Add the new JSON ID fields to the detail view
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'title', 'full_name', 'about', 'age', 'email', 'phone', 'section_order')
        }),
        ('Profile Library References (new system)', {
            'fields': (
                'profile_education_ids',
                'profile_experience_ids',
                'profile_project_ids',
                'profile_skill_ids',
                'profile_language_ids',
                'profile_achievement_ids'
            ),
            'classes': ('collapse',),
            'description': 'These are the ordered IDs from the user\'s global profile library.'
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )

    readonly_fields = ('created_at', 'updated_at')


# ============================================================================
# LEGACY MODEL ADMINS (unchanged, kept for old data)
# ============================================================================

@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ('resume', 'institution', 'degree', 'start_date', 'end_date', 'order')
    search_fields = ('institution', 'degree')
    list_filter = ('start_date',)
    raw_id_fields = ('resume',)

@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ('resume', 'company', 'position', 'start_date', 'end_date', 'order')
    search_fields = ('company', 'position')
    list_filter = ('start_date',)
    raw_id_fields = ('resume',)

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('resume', 'name', 'start_date', 'end_date', 'order')
    search_fields = ('name',)
    raw_id_fields = ('resume',)

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('resume', 'name', 'proficiency')
    search_fields = ('name',)
    raw_id_fields = ('resume',)

@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    list_display = ('resume', 'name', 'proficiency')
    search_fields = ('name',)
    raw_id_fields = ('resume',)

@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ('resume', 'description_short')
    search_fields = ('description',)
    raw_id_fields = ('resume',)

    def description_short(self, obj):
        return obj.description[:50] + '...' if len(obj.description) > 50 else obj.description
    description_short.short_description = 'Description'


# ============================================================================
# NEW PROFILE MODEL ADMINS
# ============================================================================

@admin.register(ProfileEducation)
class ProfileEducationAdmin(admin.ModelAdmin):
    list_display = ('user', 'institution', 'degree', 'field_of_study', 'start_date', 'end_date')
    search_fields = ('institution', 'degree', 'field_of_study')
    list_filter = ('start_date', 'end_date')
    raw_id_fields = ('user',)
    ordering = ['-start_date', 'institution']


@admin.register(ProfileExperience)
class ProfileExperienceAdmin(admin.ModelAdmin):
    list_display = ('user', 'company', 'position', 'start_date', 'end_date', 'is_current')
    search_fields = ('company', 'position')
    list_filter = ('start_date', 'end_date', 'is_current')
    raw_id_fields = ('user',)
    ordering = ['-start_date', 'company']


@admin.register(ProfileProject)
class ProfileProjectAdmin(admin.ModelAdmin):
    list_display = ('user', 'name', 'start_date', 'end_date', 'url')
    search_fields = ('name', 'description')
    list_filter = ('start_date', 'end_date')
    raw_id_fields = ('user',)
    ordering = ['-start_date', 'name']


@admin.register(ProfileSkill)
class ProfileSkillAdmin(admin.ModelAdmin):
    list_display = ('user', 'name', 'proficiency')
    search_fields = ('name',)
    raw_id_fields = ('user',)
    ordering = ['name']


@admin.register(ProfileLanguage)
class ProfileLanguageAdmin(admin.ModelAdmin):
    list_display = ('user', 'name', 'proficiency')
    search_fields = ('name',)
    raw_id_fields = ('user',)
    ordering = ['name']


@admin.register(ProfileAchievement)
class ProfileAchievementAdmin(admin.ModelAdmin):
    list_display = ('user', 'description_short', 'created_at')
    search_fields = ('description',)
    raw_id_fields = ('user',)
    ordering = ['-created_at']

    def description_short(self, obj):
        return obj.description[:50] + '...' if len(obj.description) > 50 else obj.description
    description_short.short_description = 'Description'


# ============================================================================
# JOB APPLICATION & TAG ADMINS (unchanged)
# ============================================================================

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ('company', 'position', 'status', 'user', 'date_applied', 'deadline_date', 'created_at')
    list_filter = ('status', 'date_applied', 'deadline_date')
    search_fields = ('company', 'position', 'notes', 'user__email')
    raw_id_fields = ('user', 'resume_used')
