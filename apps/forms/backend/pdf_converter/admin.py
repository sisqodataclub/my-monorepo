# pdf_converter/admin.py
from django.contrib import admin
from django.utils.html import format_html
from django.utils import timezone
from .models import PDFUser, EmailLoginCode, PDFTemplate, PDFExport


@admin.register(PDFUser)
class PDFUserAdmin(admin.ModelAdmin):
    list_display = (
        'email', 'total_conversions', 'total_uploads', 
        'last_activity', 'is_active', 'api_key_status'
    )
    list_filter = ('is_active', 'created_at')
    search_fields = ('email', 'api_key')
    readonly_fields = ('api_key', 'created_at', 'updated_at', 'total_conversions', 'total_uploads', 'last_activity')
    ordering = ('-created_at',)
    fieldsets = (
        ('User Info', {
            'fields': ('email', 'django_user', 'is_active')
        }),
        ('API Key', {
            'fields': ('api_key', 'api_key_expires_at'),
            'classes': ('collapse',),
        }),
        ('Usage', {
            'fields': ('total_conversions', 'total_uploads', 'last_activity'),
        }),
        ('Preferences', {
            'fields': ('preferences',),
            'classes': ('collapse',),
        }),
    )

    def api_key_status(self, obj):
        if obj.api_key_expires_at and obj.api_key_expires_at < timezone.now():
            return format_html('<span style="color: red;">⚠️ Expired</span>')
        return format_html('<span style="color: green;">✅ Valid</span>')
    api_key_status.short_description = 'API Key Status'


@admin.register(EmailLoginCode)
class EmailLoginCodeAdmin(admin.ModelAdmin):
    list_display = ('email', 'pdf_user', 'code', 'is_used', 'created_at')
    list_filter = ('is_used', 'created_at')
    search_fields = ('email', 'code', 'pdf_user__email')
    readonly_fields = ('code', 'created_at')
    ordering = ('-created_at',)


@admin.register(PDFTemplate)
class PDFTemplateAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_active', 'created_by', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'slug', 'description')
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ('created_at', 'updated_at')


@admin.register(PDFExport)
class PDFExportAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'template', 'pdf_user', 'status', 'source_type',
        'file_size', 'created_at', 'completed_at'
    )
    list_filter = ('status', 'source_type', 'created_at')
    search_fields = ('id', 'template__name', 'pdf_user__email', 'api_key_used')
    readonly_fields = ('created_at', 'completed_at')
    ordering = ('-created_at',)
