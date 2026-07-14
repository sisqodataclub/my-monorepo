# pdf_converter/serializers.py
from rest_framework import serializers
from .models import PDFTemplate, PDFExport

class PDFTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PDFTemplate
        fields = ['id', 'name', 'slug', 'description', 'is_active', 'created_at']

class PDFExportSerializer(serializers.ModelSerializer):
    class Meta:
        model = PDFExport
        fields = ['id', 'template', 'status', 'context_data', 'created_at', 'completed_at', 'error_message']

class PDFGenerateSerializer(serializers.Serializer):
    """Serializer for PDF generation requests"""
    template_slug = serializers.CharField(required=False, allow_blank=True)
    html = serializers.CharField(required=False, allow_blank=True)
    context = serializers.JSONField(required=False, default=dict)
    css = serializers.CharField(required=False, default='', allow_blank=True)
    filename = serializers.CharField(required=False, default='document.pdf')
    async_mode = serializers.BooleanField(required=False, default=False)
    
    def validate(self, data):
        # Must provide either template_slug or html
        if not data.get('template_slug') and not data.get('html'):
            raise serializers.ValidationError(
                "Either 'template_slug' or 'html' must be provided."
            )
        return data
