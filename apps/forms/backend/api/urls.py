from django.urls import path

# Cleaned up: Import everything from views in one neat block
from .views import (
    NoteListCreate, NoteDelete,
    BlogListCreate, BlogRetrieveUpdateDestroy,
    CommentListCreate,
    ContactMessageListCreate, contact_view,
    CurrentUserView,
    KPIDashboardView,
    BookingCreateView, booking_snapshot, payment_link,
    UKEconomyDashboardView,
    SupersetRefreshWebhookView, # 🌟 NEW WEBHOOK IMPORT
    get_ecommerce_funnel        # 🌟 ADDED BIGQUERY FUNNEL IMPORT
)

urlpatterns = [
    # Notes
    path("notes/", NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", NoteDelete.as_view(), name="delete-note"),

    # Blogs & Comments
    path("blogs/", BlogListCreate.as_view(), name="blog-list-create"),
    path("blogs/<int:pk>/", BlogRetrieveUpdateDestroy.as_view(), name="blog-detail"),
    path("blogs/<int:pk>/comments/", CommentListCreate.as_view(), name="comments"),

    # Users
    path("user/", CurrentUserView.as_view(), name="current-user"),

    # Contact
    path("contact/", contact_view, name="contact"),
    path("contact-messages/", ContactMessageListCreate.as_view(), name="contact-messages"),

    # Cleaning Dashboard KPIs
    path("kpis/", KPIDashboardView.as_view(), name="dashboard-kpis"),

    # Bookings & Payments
    path("bookings/", BookingCreateView.as_view(), name="booking-create"),
    path("booking-snapshots/", booking_snapshot, name="booking_snapshot"),
    path("payment-link/", payment_link, name="payment_link"),

    # UK Economy Dashboard
    path('economy/kpis/', UKEconomyDashboardView.as_view(), name='economy-kpis'),

    # 🌟 NEW: Webhooks (For Airflow -> Django communication)
    path('webhooks/refresh-superset/', SupersetRefreshWebhookView.as_view(), name='webhook-refresh-superset'),

    # 🌟 NEW: The BigQuery Funnel Route (Removed the 'views.' prefix!)
    path('ecommerce/funnel/', get_ecommerce_funnel, name='ecommerce_funnel'),
]
