from django.db import models

# Create your models here.

class Resume(models.Model):
    # Make user optional for now (no authentication)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True
    )

    full_name = models.CharField(max_length=100)
    about = models.TextField()
    age = models.IntegerField(null=True, blank=True)
    email = models.EmailField()
    phone = models.CharField(max_length=15)

    skills = models.TextField(help_text="Comma-separated skills")
    languages = models.TextField(help_text="Comma-separated languages")

    education1 = models.TextField()
    education2 = models.TextField(blank=True, null=True)
    education3 = models.TextField(blank=True, null=True)

    project1 = models.TextField()
    project2 = models.TextField(blank=True, null=True)

    experience1 = models.TextField()
    experience2 = models.TextField(blank=True, null=True)

    achievements = models.TextField(help_text="Comma-separated achievements")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.full_name


class JobApplication(models.Model):
    STATUS_CHOICES = [
        ('saved', 'Saved'),
        ('applied', 'Applied'),
        ('interviewing', 'Interviewing'),
        ('offered', 'Offered'),
        ('rejected', 'Rejected'),
    ]

    # Make user optional for now (no authentication)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='applications'
    )

    job_link = models.URLField()
    company = models.CharField(max_length=200)
    position = models.CharField(max_length=200)
    date_applied = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='saved')
    
    # Link to the resume used for this application
    resume_used = models.ForeignKey(
        Resume, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='applications'
    )
    
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.full_name or 'Anonymous'} - {self.position} at {self.company}"
