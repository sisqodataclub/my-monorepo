# api/tasks.py
from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from django.core.cache import cache

# Import your superset functions
from .superset_utils import fetch_economy_kpis, fetch_economy_charts

@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_async_email(self, subject, message, recipient_list, html_message=None):
    """
    Universal background task for sending emails via RabbitMQ & Celery.
    Includes auto-retry logic for SMTP failures.
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
    except Exception as exc:
        try:
            self.retry(exc=exc)
        except self.MaxRetriesExceededError:
            return f"Failed permanently to send email to {recipient_list}. Error: {str(exc)}"

@shared_task(bind=True, max_retries=3, default_retry_delay=30)
def refresh_uk_economy_cache(self):
    """
    Fetches heavy data from Superset in the background and sets it
    in the Django cache permanently (until the next Airflow run).
    """
    try:
        superset_kpis = fetch_economy_kpis()
        superset_charts = fetch_economy_charts()

        if "error" in superset_kpis or "error" in superset_charts:
            raise Exception("Superset returned an error during fetch.")

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

        # Set cache with NO timeout (lives forever until overwritten)
        cache.set("uk_economy_dashboard_data", formatted_response, timeout=None)
        return "Superset Cache Successfully Rebuilt!"

    except Exception as exc:
        self.retry(exc=exc)
