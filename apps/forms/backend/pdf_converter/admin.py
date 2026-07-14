# pdf_converter/admin.py
from django.contrib import admin
from .models import EmailLoginCode, PDFTemplate, PDFExport


@admin.register(EmailLoginCode)
class EmailLoginCodeAdmin(admin.ModelAdmin):
    list_display = ('email', 'code', 'is_used', 'created_at')
    list_filter = ('is_used', 'created_at')
    search_fields = ('email', 'code')
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
    list_display = ('id', 'template', 'user', 'status', 'created_at', 'completed_at')
    list_filter = ('status', 'created_at', 'completed_at')
    search_fields = ('id', 'template__name', 'user__email', 'api_key_used')
    readonly_fields = ('created_at', 'completed_at')
    ordering = ('-created_at',)
    fieldsets = (
        (None, {
            'fields': ('template', 'user', 'context_data', 'status', 'pdf_file', 'error_message')
        }),
        ('Audit', {
            'fields': ('ip_address', 'api_key_used', 'created_at', 'completed_at'),
            'classes': ('collapse',),
        }),
    )
