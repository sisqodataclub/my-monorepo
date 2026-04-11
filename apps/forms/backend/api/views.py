import os
import re
import stripe
from datetime import timedelta

from django.contrib.auth.models import User
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.utils import timezone
from django.db.models import Sum, Count
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView
from django.conf import settings

from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.throttling import ScopedRateThrottle

from .models import Note, Blog, Booking, ContactMessage, Comment, BookingSnapshot
from .serializers import (
    NoteSerializer, BlogSerializer, UserSerializer, UserCreateSerializer,
    ContactMessageSerializer, CommentSerializer, BookingSerializer, BookingSnapshotSerializer
)

# 🌟 IMPORT OUR NEW CELERY TASK
from .tasks import send_async_email

stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")

# ==========================================
# DASHBOARD & KPIs
# ==========================================
class KPIDashboardView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        now = timezone.now()

        # 1. This Year
        start_of_year = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
        year_qs = Booking.objects.filter(created_at__gte=start_of_year)
        year_revenue = year_qs.aggregate(total=Sum('total'))['total'] or 0
        year_count = year_qs.count()

        # 2. This Month
        start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        month_qs = Booking.objects.filter(created_at__gte=start_of_month)
        month_revenue = month_qs.aggregate(total=Sum('total'))['total'] or 0
        month_count = month_qs.count()

        # 3. This Week (Starting Monday)
        start_of_week = (now - timedelta(days=now.weekday())).replace(hour=0, minute=0, second=0, microsecond=0)
        week_qs = Booking.objects.filter(created_at__gte=start_of_week)
        week_revenue = week_qs.aggregate(total=Sum('total'))['total'] or 0
        week_count = week_qs.count()

        kpi_data = [
            {"id": "year", "title": "This Year", "revenue": f"£{year_revenue:,.2f}", "bookings": year_count},
            {"id": "month", "title": "This Month", "revenue": f"£{month_revenue:,.2f}", "bookings": month_count},
            {"id": "week", "title": "This Week", "revenue": f"£{week_revenue:,.2f}", "bookings": week_count}
        ]
        return Response(kpi_data)


class ReactAppView(TemplateView):
    template_name = "index.html"


# ==========================================
# CONTACT MESSAGES
# ==========================================
class ContactMessageListCreate(generics.ListCreateAPIView):
    queryset = ContactMessage.objects.all().order_by('-created')
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'contact_limit'

    def perform_create(self, serializer):
        author = self.request.user if self.request.user.is_authenticated else None
        contact_message = serializer.save(author=author)

        total_quote = None
        match = re.search(r'£(\d+(?:\.\d+)?)', contact_message.message)
        if match:
            total_quote = match.group(1)

        latest_booking = Booking.objects.filter(email=contact_message.email).order_by('-created_at').first()
        booking_items = latest_booking.quantities if latest_booking else None

        context = {
            'contact': contact_message,
            'booking_items': booking_items,
            'total_quote': total_quote,
            'phone': getattr(latest_booking, 'phone', None) if latest_booking else None,
            'parking': getattr(latest_booking, 'parking', None) if latest_booking else None,
            'furnished': getattr(latest_booking, 'furnished_status', None) if latest_booking else None,
            'booking_id': latest_booking.id if latest_booking else None,
        }

        subject = 'Enquiry Confirmation!'
        html_message = render_to_string('thankyou.html', context)
        plain_message = strip_tags(html_message)

        # 🌟 SENT TO CELERY (ASYNC)
        send_async_email.delay(
            subject=subject,
            message=plain_message,
            recipient_list=[contact_message.email, 'francis@dataclubcenter.com'],
            html_message=html_message
        )

@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
@authentication_classes([])
def contact_view(request):
    name = request.data.get("name")
    email = request.data.get("email")
    message = request.data.get("message")

    try:
        # 🌟 SENT TO CELERY: Notify Admin
        send_async_email.delay(
            subject=f"New Contact Form Submission from {name}",
            message=f"You have a new inquiry!\n\nName: {name}\nEmail: {email}\n\nMessage:\n{message}",
            recipient_list=["francis@dataclubcenter.com"],
        )

        if email:
            # 🌟 SENT TO CELERY: Notify User
            send_async_email.delay(
                subject="Thank you for contacting Ddeep Cleaning Services!",
                message=f"Hi {name},\n\nThank you for reaching out! We have received your message and will get back to you as soon as possible with a quote.\n\nYour message:\n{message}\n\nBest regards,\nDdeep Cleaning Services",
                recipient_list=[email],
            )

        return Response({"message": "Emails are being sent in the background."}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ==========================================
# NOTES
# ==========================================
class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(author=self.request.user)

    def perform_create(self, serializer):
        note = serializer.save(author=self.request.user)
        try:
            subject = 'New Note Created'
            html_message = render_to_string('quote.html', {
                'name': self.request.user.get_full_name() or self.request.user.username,
                'email': self.request.user.email,
                'note_title': note.title,
                'note_content': note.content,
            })
            plain_message = strip_tags(html_message)
            
            # 🌟 SENT TO CELERY (ASYNC)
            send_async_email.delay(
                subject=subject,
                message=plain_message,
                recipient_list=[self.request.user.email, 'francis@dataclubcenter.com'],
                html_message=html_message
            )
        except Exception as e:
            print(f"Failed to queue email: {e}")

class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(author=self.request.user)


# ==========================================
# BLOGS & COMMENTS
# ==========================================
class BlogListCreate(generics.ListCreateAPIView):
    serializer_class = BlogSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Blog.objects.prefetch_related('blocks', 'comments').all()

        author_id = self.request.query_params.get('author')
        tag = self.request.query_params.get('tag')

        if author_id:
            queryset = queryset.filter(author__id=author_id)
        if tag:
            queryset = queryset.filter(tag__icontains=tag)

        return queryset

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class BlogRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BlogSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Blog.objects.prefetch_related('blocks', 'comments').all()

    def perform_update(self, serializer):
        if self.request.user != self.get_object().author:
            raise PermissionDenied("Cannot edit another user's blog.")
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user != instance.author:
            raise PermissionDenied("Cannot delete another user's blog.")
        instance.delete()

class CommentListCreate(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Comment.objects.filter(blog_id=self.kwargs["pk"])

    def perform_create(self, serializer):
        blog = Blog.objects.get(pk=self.kwargs["pk"])
        user = self.request.user if self.request.user.is_authenticated else None
        guest_label = f"Guest {timezone.now():%Y-%m-%d %H:%M}" if not user else ""
        serializer.save(blog=blog, author=user, guest_name=guest_label)


# ==========================================
# USERS
# ==========================================
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserCreateSerializer(request.user)
        return Response(serializer.data)


# ==========================================
# BOOKINGS & PAYMENTS
# ==========================================
class BookingCreateView(generics.CreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [AllowAny]
    authentication_classes = []
    queryset = Booking.objects.all()

    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'booking_limit'

@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
@authentication_classes([])
def booking_snapshot(request):
    session_id = request.data.get("session_id")
    if not session_id:
        return Response({"error": "session_id is required"}, status=400)

    snapshot = BookingSnapshot.objects.filter(session_id=session_id, is_final=False).last()

    if snapshot:
        serializer = BookingSnapshotSerializer(snapshot, data=request.data, partial=True)
    else:
        serializer = BookingSnapshotSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response({"status": "saved", "snapshot_id": serializer.instance.id}, status=200)

    return Response(serializer.errors, status=400)

@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
@authentication_classes([])
def payment_link(request):
    try:
        total = request.data.get("total")
        if not total:
            return Response({"error": "Total is required"}, status=400)

        amount = int(float(total) * 100)

        session = stripe.checkout.Session.create(
            success_url="http://localhost:3000/success",
            cancel_url="http://localhost:3000/cancel",
            payment_method_types=["card"],
            line_items=[{
                "price_data": {
                    "currency": "gbp",
                    "unit_amount": amount,
                    "product_data": {"name": "Cleaning Booking Payment"},
                },
                "quantity": 1,
            }],
            mode="payment",
        )
        return Response({"paymentlink": session.url}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ==========================================
# UK ECONOMY DASHBOARD (SUPERSET PROXY)
# ==========================================
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from .superset_utils import fetch_economy_kpis, fetch_economy_charts
from django.core.cache import cache

@method_decorator(csrf_exempt, name='dispatch')
class UKEconomyDashboardView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        cached_dashboard = cache.get("uk_economy_dashboard_data")
        if cached_dashboard:
            return Response(cached_dashboard, status=status.HTTP_200_OK)

        superset_kpis = fetch_economy_kpis()
        superset_charts = fetch_economy_charts()

        if "error" in superset_kpis or "error" in superset_charts:
            return Response({"error": "Superset unavailable"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        formatted_response = {
            "status": "success",
            "kpis": {
                "headline_inflation": {
                    "title": "Current Inflation Rate",
                    "value": f"{superset_kpis.get('headline_rate', 0)}%",
                    "subtitle": "Official UK CPIH Rate"
                },
                "economic_trajectory": {
                    "title": "Monthly Trajectory",
                    "value": f"{superset_kpis.get('trajectory_change', 0)}%",
                    "subtitle": "Versus Previous Month"
                },
                "wallet_squeeze": {
                    "title": "Most Expensive Category",
                    "value": superset_kpis.get('top_category_name', 'N/A'),
                    "subtitle": f"+{superset_kpis.get('top_category_rate', 0)}% YoY"
                }
            },
            "charts": {
                "inflation_trend": superset_charts.get('trend_array') or [],
                "category_breakdown": superset_charts.get('category_array') or []
            }
        }

        cache.set("uk_economy_dashboard_data", formatted_response, 86400)
        return Response(formatted_response, status=status.HTTP_200_OK)
