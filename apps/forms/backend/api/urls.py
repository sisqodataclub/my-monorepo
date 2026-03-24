from django.urls import path
from . import views
from .views import CurrentUserView

from .views import (
    BlogListCreate, 
    BlogRetrieveUpdateDestroy, 
    CommentListCreate, 
    ContactMessageListCreate,
    contact_view  # <-- Import the new view here
)

from .views import BookingCreateView
from .views import booking_snapshot, payment_link

urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
    
    path("blogs/", views.BlogListCreate.as_view(), name="blog-list-create"),
    path("blogs/<int:pk>/", views.BlogRetrieveUpdateDestroy.as_view(), name="blog-detail"),
    path("user/", views.CurrentUserView.as_view(), name="current-user"),
    
    # Comments endpoint
    path("blogs/<int:pk>/comments/", CommentListCreate.as_view(), name="comments"),

    # ✅ The new simple contact endpoint for your frontend Contact.jsx
    path("contact/", contact_view, name="contact"),

    # Old contact messages endpoint (left here in case other parts of your app use it)
    path("contact-messages/", ContactMessageListCreate.as_view(), name="contact-messages"),
    
    # Bookings & Payments
    path("bookings/", BookingCreateView.as_view(), name="booking-create"),
    path("booking-snapshots/", booking_snapshot, name="booking_snapshot"),
    path("payment-link/", payment_link, name="payment_link"),
]
