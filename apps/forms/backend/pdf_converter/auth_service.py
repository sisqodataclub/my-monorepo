# pdf_converter/auth_service.py
import os
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
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

        # 3. Build the magic link using environment variable
        # Get the frontend URL from environment, with a fallback
        frontend_url = os.getenv('FRONTEND_URL', 'https://www.franciscodes.com')
        magic_link = f"{frontend_url}/pdf/verify?code={code}"

        # 4. Render the HTML email template
        html_message = render_to_string('emails/magic_link_email.html', {
            'user': pdf_user,
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
