from django.db import models
from django.contrib.auth.models import User


from django.contrib.postgres.fields import ArrayField
from django.db.models import JSONField



class BookingSnapshot(models.Model):
    session_id = models.CharField(max_length=100, db_index=True)
    selected_areas = models.JSONField(default=list, blank=True)
    quantities = models.JSONField(default=dict, blank=True)
    details = models.JSONField(default=dict, blank=True)
    is_final = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)



class Booking(models.Model):
    # Personal details
    name = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=30, blank=True, null=True)
    payment_method = models.CharField(max_length=50, default="cash")


    # Property details
    furnished_status = models.CharField(max_length=50, blank=True, null=True)
    parking = models.CharField(max_length=50, blank=True, null=True)

    # Cleaning selections
    selected_areas = models.JSONField(blank=True, default=list)   # was ArrayField → now JSONField
    quantities = models.JSONField(blank=True, default=dict)       # works on SQLite + PostgreSQL


    # ➕ Add new fields
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    paymentlink = models.URLField(max_length=500, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Booking from {self.name} on {self.created_at.date()}"

# api/models.py
class ContactMessage(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    message = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return f"Message from {self.name} ({self.email})"




class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="notes"  # user.notes.all()
    )

    def __str__(self):
        return self.title




class Blog(models.Model):
    title   = models.CharField(max_length=255)
    created = models.DateTimeField(auto_now_add=True)

    # optional “headline” extras
    tag     = models.CharField(max_length=100, blank=True)
    snippet = models.TextField(blank=True)
    image   = models.URLField(blank=True)

    author  = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="blogs"
    )

    class Meta:
        ordering = ["-created"]

    def __str__(self):
        return self.title


class BlogBlock(models.Model):
    """
    One paragraph / quote / image that belongs to a Blog
    """
    blog   = models.ForeignKey(
        Blog, on_delete=models.CASCADE, related_name="blocks"
    )
    order  = models.PositiveIntegerField(default=0, db_index=True)
    text   = models.TextField(blank=True)
    image  = models.URLField(blank=True)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.blog.title[:30]} – block {self.order}"



class Comment(models.Model):
    blog    = models.ForeignKey("Blog", on_delete=models.CASCADE,
                                related_name="comments")
    author  = models.ForeignKey(User, on_delete=models.SET_NULL,
                                null=True, blank=True,
                                related_name="comments")
    guest_name = models.CharField(max_length=80, blank=True)   # populated if author is NULL
    text    = models.TextField()
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created"]

    def __str__(self):
        who = self.author.username if self.author else self.guest_name
        return f"{who} on {self.blog.title[:30]}…"
