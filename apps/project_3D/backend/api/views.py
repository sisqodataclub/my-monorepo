from django.contrib.auth.models import User
from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Note, Blog
from .serializers import NoteSerializer, BlogSerializer, UserSerializer, UserCreateSerializer

from django.views.generic import TemplateView
from .models import Booking
import os


class ReactAppView(TemplateView):
    template_name = "index.html"


# views.py
from .models import ContactMessage
from .serializers import ContactMessageSerializer


from rest_framework.authentication import SessionAuthentication, BasicAuthentication

class ContactMessageListCreate(generics.ListCreateAPIView):
    queryset = ContactMessage.objects.all().order_by('-created')
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []  # ✅ disable token/session requirement


    def perform_create(self, serializer):
        author = self.request.user if self.request.user.is_authenticated else None
        contact_message = serializer.save(author=author)

        # ------------------------------------------------------------
        # 🔥 Extract TOTAL QUOTE from contact_message.message
        # ------------------------------------------------------------
        total_quote = None
        import re
        match = re.search(r'£(\d+(?:\.\d+)?)', contact_message.message)
        if match:
            total_quote = match.group(1)

        # ------------------------------------------------------------
        # 🔥 Fetch latest booking (only for items, not quote)
        # ------------------------------------------------------------
        latest_booking = Booking.objects.filter(
            email=contact_message.email
        ).order_by('-created_at').first()

        booking_items = latest_booking.quantities if latest_booking else None

        # ------------------------------------------------------------
        # 🔥 Build context with extracted quote (NOT from booking)
        # ------------------------------------------------------------
        context = {
            'contact': contact_message,
            'booking_items': booking_items,
            'total_quote': total_quote,                   # ✔ now from message
            'phone': getattr(latest_booking, 'phone', None) if latest_booking else None,
            'parking': getattr(latest_booking, 'parking', None) if latest_booking else None,
            'furnished': getattr(latest_booking, 'furnished_status', None) if latest_booking else None,
            'booking_id': latest_booking.id if latest_booking else None,
        }

        # ------------------------------------------------------------
        # 🔥 Send Email
        # ------------------------------------------------------------
        subject = 'Enquiry Confirmation!'
        html_message = render_to_string('thankyou.html', context)
        plain_message = strip_tags(html_message)

        send_mail(
            subject,
            plain_message,
            'francis@dataclubcenter.com',
            [contact_message.email, 'francis@dataclubcenter.com'],
            html_message=html_message
        )



#class NoteListCreate(generics.ListCreateAPIView):
#   serializer_class = NoteSerializer
#    permission_classes = [permissions.IsAuthenticated]
#
#    def get_queryset(self):
#        return Note.objects.filter(author=self.request.user)

#    def perform_create(self, serializer):
#        serializer.save(author=self.request.user)

from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags

class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(author=self.request.user)

    def perform_create(self, serializer):
        note = serializer.save(author=self.request.user)

        # --- Trigger email after creating note ---
        try:
            subject = 'New Note Created'
            html_message = render_to_string(
                'quote.html',  # Template path
                {
                    'name': self.request.user.get_full_name() or self.request.user.username,
                    'email': self.request.user.email,
                    'note_title': note.title,
                    'note_content': note.content,
                }
            )
            plain_message = strip_tags(html_message)
            from_email = 'francis@dataclubcenter.com'
            to_email = [self.request.user.email, 'francis@dataclubcenter.com']

            send_mail(
                subject,
                plain_message,
                from_email,
                to_email,
                html_message=html_message
            )
        except Exception as e:
            # Log or print error without breaking API
            print(f"Email sending failed: {e}")




class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(author=self.request.user)


class BlogListCreate(generics.ListCreateAPIView):
    serializer_class = BlogSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        author_id = self.request.query_params.get('author')
        if author_id:
            return Blog.objects.filter(author__id=author_id)
        return Blog.objects.all()

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class BlogRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BlogSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Blog.objects.all()

    def perform_update(self, serializer):
        if self.request.user != self.get_object().author:
            raise PermissionDenied("Cannot edit another user's blog.")
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user != instance.author:
            raise PermissionDenied("Cannot delete another user's blog.")
        instance.delete()


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]


from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserCreateSerializer(request.user)
        return Response(serializer.data)


# api/views.py
from rest_framework import generics, permissions
from .models import Comment, Blog
from .serializers import CommentSerializer
from datetime import datetime

class CommentListCreate(generics.ListCreateAPIView):
    """
    GET /api/blogs/<pk>/comments/  -> list
    POST /api/blogs/<pk>/comments/ -> create
    """
    serializer_class   = CommentSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Comment.objects.filter(blog_id=self.kwargs["pk"])

    def perform_create(self, serializer):
        blog = Blog.objects.get(pk=self.kwargs["pk"])
        user = self.request.user if self.request.user.is_authenticated else None
        guest_label = ""
        if not user:
            guest_label = f"Guest {datetime.now():%Y-%m-%d %H:%M}"
        serializer.save(blog=blog, author=user, guest_name=guest_label)



from django.core.mail import send_mail
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(["POST"])
def contact_view(request):
    name = request.data.get("name")
    email = request.data.get("email")
    message = request.data.get("message")

    try:
        send_mail(
            subject=f"New Contact Form Submission from {name}",
            message=message,
            from_email="francis@dataclubcenter.com",
            recipient_list=["francis@dataclubcenter.com"],  # Or wherever you want to receive

            fail_silently=False,
        )
        return Response({"message": "Email sent successfully."}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


from .models import Booking
from .serializers import BookingSerializer


class BookingCreateView(generics.CreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []  # 👈 THIS FIXES YOUR 401
    queryset = Booking.objects.all()


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response 
from rest_framework import status

from .models import BookingSnapshot
from .serializers import BookingSnapshotSerializer

from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import authentication_classes


@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
@authentication_classes([])  # ⬅ this is REQUIRED
def booking_snapshot(request):
    session_id = request.data.get("session_id")

    if not session_id:
        return Response({"error": "session_id is required"}, status=400)

    # Try to find existing snapshot for that session
    snapshot = BookingSnapshot.objects.filter(
        session_id=session_id, is_final=False
    ).last()

    if snapshot:
        # Update instead of creating new
        serializer = BookingSnapshotSerializer(snapshot, data=request.data, partial=True)
    else:
        # Create fresh snapshot
        serializer = BookingSnapshotSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(
            {"status": "saved", "snapshot_id": serializer.instance.id},
            status=200
        )

    return Response(serializer.errors, status=400)





from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
import stripe

stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")


@csrf_exempt                     # 🔥 REQUIRED
@api_view(["POST"])
@permission_classes([AllowAny])
@authentication_classes([])      # 🔥 REQUIRED
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
                    "product_data": {
                        "name": "Cleaning Booking Payment"
                    },
                },
                "quantity": 1,
            }],
            mode="payment",
        )

        return Response(
            {"paymentlink": session.url},
            status=status.HTTP_200_OK
        )

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

