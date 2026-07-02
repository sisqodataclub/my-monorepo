from django.contrib import admin
from .models import (
    Resume, Education, Experience, Project,
    Skill, Language, Achievement, JobApplication
)

# ========== Inline Admin Classes ==========

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


# ========== Main Admin Registration ==========

@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'phone', 'user', 'created_at')
    search_fields = ('full_name', 'email', 'user__email')
    list_filter = ('created_at',)
    raw_id_fields = ('user',)
    inlines = [
        EducationInline,
        ExperienceInline,
        ProjectInline,
        SkillInline,
        LanguageInline,
        AchievementInline,
    ]

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


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ('company', 'position', 'status', 'user', 'date_applied', 'deadline_date', 'created_at')
    list_filter = ('status', 'date_applied', 'deadline_date')
    search_fields = ('company', 'position', 'notes', 'user__email')
    raw_id_fields = ('user', 'resume_used')
