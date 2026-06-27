from django.contrib import admin
from .models import Resume, JobApplication

@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'phone', 'created_at')
    search_fields = ('full_name', 'email')
    list_filter = ('created_at',)

@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ('company', 'position', 'status', 'date_applied', 'created_at')
    list_filter = ('status', 'date_applied')
    search_fields = ('company', 'position', 'notes')
    raw_id_fields = ('resume_used',)  # useful if you have many resumes
