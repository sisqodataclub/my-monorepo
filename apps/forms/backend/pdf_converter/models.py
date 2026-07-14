# pdf_converter/models.py
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import secrets

class EmailLoginCode(models.Model):
    """Store magic link login codes (7-day expiry)"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='login_codes')
    email = models.EmailField()
    code = models.CharField(max_length=32, unique=True)
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def is_valid(self):
        expiry_time = self.created_at + timezone.timedelta(seconds=604800)  # 7 days
        return not self.is_used and timezone.now() <= expiry_time
    
    @staticmethod
    def generate_code():
        return secrets.token_urlsafe(16)
    
    def __str__(self):
        return f"Code for {self.email} - {self.code[:6]}..."

class PDFTemplate(models.Model):
    """Store reusable PDF templates (HTML/CSS)"""
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    html_content = models.TextField()
    css_content = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name

class PDFExport(models.Model):
    """Track every PDF generation (for auditing & analytics)"""
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    )
    
    template = models.ForeignKey(PDFTemplate, on_delete=models.SET_NULL, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    context_data = models.JSONField(default=dict)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    pdf_file = models.FileField(upload_to='pdfs/', blank=True, null=True)
    error_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(blank=True, null=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    api_key_used = models.CharField(max_length=255, blank=True)
    
    def __str__(self):
        return f"{self.template.name if self.template else 'Custom'} - {self.created_at}"
