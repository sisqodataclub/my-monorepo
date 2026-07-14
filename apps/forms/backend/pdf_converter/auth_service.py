# pdf_converter/auth_service.py
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from django.urls import reverse
from .models import EmailLoginCode

class AuthService:

    @staticmethod
    def send_login_email(request, email):
        """Generate a code and send a beautiful HTML magic link email."""
        # 1. Get or create the user
        user, created = User.objects.get_or_create(email=email, defaults={'username': email})
        if created:
            user.set_unusable_password()
            user.save()

        # 2. Generate and save the code
        code = EmailLoginCode.generate_code()
        login_code_obj = EmailLoginCode.objects.create(
            user=user,
            email=email,
            code=code
        )

        # 3. Build the magic link
        magic_link = request.build_absolute_uri(
            reverse('pdf_converter:verify_login', kwargs={'code': code})
        )
        
        # Optionally, build a React-specific link:
        # magic_link = f"https://your-react-app.com/verify?code={code}"

        # 4. Render the HTML email template
        html_message = render_to_string('emails/magic_link_email.html', {
            'user': user,
            'magic_link': magic_link,
            'expiry_days': 7,
        })

        # 5. Send the email with HTML content
        send_mail(
            subject="🔐 Your Magic Login Link for PDF Converter",
            message=f"Click this link to log in: {magic_link}",  # Plain text fallback
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            html_message=html_message,  # The HTML version
            fail_silently=False,
        )

        return True
