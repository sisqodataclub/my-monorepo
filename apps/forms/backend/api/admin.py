from django.contrib import admin, messages
from django.urls import path
from django.template.response import TemplateResponse
from django.db.models import Sum
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from django.template.loader import render_to_string
import platform
import pdfkit
from .models import Note, Blog, BlogBlock, Booking
from .forms import BookingAdminForm, CLEANING_TYPE_CHOICES
from django.utils import timezone
from datetime import date

# -----------------------------
# Custom Dashboard Admin Site
# -----------------------------
class DashboardAdminSite(admin.AdminSite):
    site_header = "FrancisCodes Admin"
    site_title = "FrancisCodes Admin"
    index_title = "Dashboard"

    def index(self, request, extra_context=None):
        return self.dashboard_view(request)

    def dashboard_view(self, request):
        today = timezone.now().date()
        total_users = User.objects.count()
        total_bookings = Booking.objects.count()
        total_revenue = Booking.objects.aggregate(total=Sum("total"))["total"] or 0
        bookings_today = Booking.objects.filter(created_at__date=today).count()
        revenue_today = Booking.objects.filter(created_at__date=today).aggregate(total=Sum("total"))["total"] or 0
        upcoming_bookings = Booking.objects.filter(created_at__date__gte=today).count()
        avg_order_value = total_revenue / total_bookings if total_bookings else 0
        recent_bookings = Booking.objects.order_by("-created_at")[:5]

        context = dict(
            self.each_context(request),
            total_users=total_users,
            total_bookings=total_bookings,
            total_revenue=total_revenue,
            bookings_today=bookings_today,
            revenue_today=revenue_today,
            upcoming_bookings=upcoming_bookings,
            avg_order_value=avg_order_value,
            recent_bookings=recent_bookings,
        )
        return TemplateResponse(request, "admin/dashboard.html", context)

dashboard_admin_site = DashboardAdminSite(name="dashboard_admin")

# -----------------------------
# Booking Admin
# -----------------------------
class BookingAdmin(admin.ModelAdmin):
    form = BookingAdminForm
    change_form_template = "admin/booking_change_form.html"

    list_display = ("id", "name", "email", "phone", "payment_method", "total", "display_selected_areas", "display_quantities", "created_at")
    list_filter = ("payment_method", "furnished_status", "parking", "created_at")
    search_fields = ("name", "email", "phone")
    readonly_fields = ("created_at",)

    fieldsets = (
        ("Customer Details", {"fields": ("name", "email", "phone", "payment_method")}),
        ("Property Details", {"fields": ("furnished_status", "parking")}),
        ("Cleaning Selections", {"fields": ("selected_areas", "quantities")}),  # quantities handled via JS
        ("Payment", {"fields": ("total", "paymentlink")}),
        ("System", {"fields": ("created_at",)}),
    )


    def display_quantities(self, obj):
        """Show all quantities as 'Item: Value' lines"""
        if not obj.quantities:
            return "-"
        return ", ".join(f"{k}: {v}" for k, v in obj.quantities.items())
    
    display_quantities.short_description = "Quantities"

    def display_selected_areas(self, obj):
        if not obj.selected_areas:
            return "-"
        return ", ".join(
            label for value, label in dict(
                CLEANING_TYPE_CHOICES
            ).items() if value in obj.selected_areas
        )

    display_selected_areas.short_description = "Cleaning Type"

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path("<int:booking_id>/pdf/", self.admin_site.admin_view(self.generate_pdf), name="booking_pdf"),
            path("<int:booking_id>/send-invoice/", self.admin_site.admin_view(self.send_invoice), name="booking_send_invoice"),
        ]
        return custom_urls + urls

    def generate_pdf(self, request, booking_id):
        booking = Booking.objects.get(id=booking_id)
        html = render_to_string("admin/booking_pdf.html", {"booking": booking})

        wkhtml_path = (
            r"C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe"
            if platform.system() == "Windows"
            else "/usr/local/bin/wkhtmltopdf"
        )
        config = pdfkit.configuration(wkhtmltopdf=wkhtml_path)
        pdf = pdfkit.from_string(html, False, configuration=config)

        response = HttpResponse(pdf, content_type="application/pdf")
        response["Content-Disposition"] = f"attachment; filename=booking_{booking_id}.pdf"
        return response

    def send_invoice(self, request, booking_id):
        booking = Booking.objects.get(id=booking_id)
        subject = f"Your Invoice – Booking #{booking.id}"
        body = render_to_string("email/invoice_email.html", {"booking": booking})
        recipient = booking.email

        html = render_to_string("admin/booking_pdf.html", {"booking": booking})
        wkhtml_path = (
            r"C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe"
            if platform.system() == "Windows"
            else "/usr/local/bin/wkhtmltopdf"
        )
        config = pdfkit.configuration(wkhtmltopdf=wkhtml_path)
        pdf = pdfkit.from_string(html, False, configuration=config)

        email = EmailMessage(subject, body, to=[recipient])
        email.content_subtype = "html"
        email.attach(f"invoice_{booking.id}.pdf", pdf, "application/pdf")
        email.send()

        messages.success(request, "Invoice sent successfully.")
        return HttpResponseRedirect(f"../{booking_id}/change/")

# -----------------------------
# Register models
# -----------------------------
admin.site.register(Note)
admin.site.register(Blog)
admin.site.register(BlogBlock)
admin.site.register(Booking, BookingAdmin)

dashboard_admin_site.register(Note)
dashboard_admin_site.register(Blog)
dashboard_admin_site.register(BlogBlock)
dashboard_admin_site.register(Booking, BookingAdmin)
