# pdf_converter/models.py
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import secrets


class PDFUser(models.Model):
    """
    Custom user model for the PDF Converter app.
    """
    email = models.EmailField(unique=True)
    api_key = models.CharField(max_length=64, unique=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # 📊 Usage Tracking (keep these - useful)
    total_conversions = models.IntegerField(default=0)
    total_uploads = models.IntegerField(default=0)
    last_activity = models.DateTimeField(null=True, blank=True)

    # 🔑 API Key Management
    api_key_expires_at = models.DateTimeField(null=True, blank=True)

    # 📝 User Preferences (keep for future flexibility)
    preferences = models.JSONField(default=dict, blank=True)

    # 🔗 Optional link to main Django user
    django_user = models.OneToOneField(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name='pdf_user'
    )

    def save(self, *args, **kwargs):
        if not self.api_key:
            self.api_key = secrets.token_urlsafe(32)
        super().save(*args, **kwargs)

    def increment_conversion(self):
        """Increment total conversions and update last activity."""
        self.total_conversions += 1
        self.last_activity = timezone.now()
        self.save()

    def increment_upload(self):
        """Increment total uploads."""
        self.total_uploads += 1
        self.last_activity = timezone.now()
        self.save()

    def is_api_key_valid(self):
        """Check if API key is still valid (not expired)."""
        if self.api_key_expires_at:
            return timezone.now() < self.api_key_expires_at
        return True

    def __str__(self):
        return self.email


class EmailLoginCode(models.Model):
    """Store magic link login codes (7-day expiry)"""
    pdf_user = models.ForeignKey(PDFUser, on_delete=models.CASCADE, related_name='login_codes')
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
    created_by = models.ForeignKey(PDFUser, on_delete=models.SET_NULL, null=True, blank=True)
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
    pdf_user = models.ForeignKey(PDFUser, on_delete=models.SET_NULL, null=True, blank=True)
    context_data = models.JSONField(default=dict)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    pdf_file = models.FileField(upload_to='pdfs/', blank=True, null=True)
    error_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(blank=True, null=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    api_key_used = models.CharField(max_length=255, blank=True)

    # Additional tracking fields
    file_size = models.IntegerField(default=0)  # Size in bytes
    conversion_time = models.FloatField(default=0)  # Time in seconds
    source_type = models.CharField(max_length=20, blank=True)  # 'html', 'upload', 'template'

    def __str__(self):
        return f"{self.template.name if self.template else 'Custom'} - {self.created_at}"
