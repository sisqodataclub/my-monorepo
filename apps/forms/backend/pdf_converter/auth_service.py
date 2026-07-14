# pdf_converter/auth_service.py
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from django.urls import reverse
from .models import PDFUser, EmailLoginCode

class AuthService:

    @staticmethod
    def send_login_email(request, email):
        """Generate a code and send a beautiful HTML magic link email."""
        # 1. Get or create the PDFUser (completely separate from Django auth)
        pdf_user, created = PDFUser.objects.get_or_create(email=email)

        # 2. Generate and save the code
        code = EmailLoginCode.generate_code()
        EmailLoginCode.objects.create(
            pdf_user=pdf_user,
            email=email,
            code=code
        )

        # 3. Build the magic link (points to your React frontend)
        # Example: https://your-react-app.com/verify?code=abc123
        # For testing, we can point to the backend verify endpoint.
        # We'll keep it as the API endpoint so you can test with curl.
        magic_link = request.build_absolute_uri(
            reverse('pdf_converter:api_verify_login')
        ) + f"?code={code}"

        # If you want to send the link to your React app, use:
        # magic_link = f"https://your-react-app.com/verify?code={code}"

        # 4. Render the HTML email template
        html_message = render_to_string('emails/magic_link_email.html', {
            'user': pdf_user,  # Use PDFUser in the template
            'magic_link': magic_link,
            'expiry_days': 7,
        })

        # 5. Send the email
        send_mail(
            subject="🔐 Your Magic Login Link for PDF Converter",
            message=f"Click this link to log in: {magic_link}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            html_message=html_message,
            fail_silently=False,
        )
        return True
