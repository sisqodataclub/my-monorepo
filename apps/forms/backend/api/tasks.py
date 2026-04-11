from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings

@shared_task
def send_async_email(subject, message, recipient_list, html_message=None):
    """
    Universal background task for sending emails via RabbitMQ & Celery.
    It accepts standard text, HTML templates, and lists of recipients.
    """
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=recipient_list,
            html_message=html_message,
            fail_silently=False,
        )
        return f"Success: Email sent to {recipient_list}"
    except Exception as e:
        return f"Failed to send email to {recipient_list}. Error: {str(e)}"
