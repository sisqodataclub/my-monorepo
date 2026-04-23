# api/tasks.py
from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from django.core.cache import cache

# 🌟 UPDATED: Imported fetch_net_zero_data
from .superset_utils import fetch_economy_kpis, fetch_economy_charts, fetch_net_zero_data

@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_async_email(self, subject, message, recipient_list, html_message=None):
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
    try:
        superset_kpis = fetch_economy_kpis()
        superset_charts = fetch_economy_charts()
        
        # 🌟 NEW: Fetch the Net Zero Data
        net_zero = fetch_net_zero_data()

        # 🌟 UPDATED: Check for errors in all three fetches
        if "error" in superset_kpis or "error" in superset_charts or "error" in net_zero:
            raise Exception("Superset returned an error during fetch.")

        formatted_response = {
            "status": "success",
            "kpis": {
                "headline_inflation": {
                    "title": "Current Inflation Rate",
                    "value": f"{superset_kpis.get('headline_rate', 0)}%",
                    "subtitle": "Official UK CPIH Rate"
                },
                "core_inflation": {
                    "title": "Core Inflation",
                    "value": f"{superset_kpis.get('core_rate', 0)}%",
                    "subtitle": "Excl. Food, Energy, Alcohol"
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
                "category_breakdown": superset_charts.get('category_array') or [],
                "heatmap_array": superset_charts.get('heatmap_array') or []
            },
            # 🌟 NEW: Inject the Energy Data directly into the existing payload
            "energy": {
                "kpis": net_zero.get("latest_kpis", {}),
                "graph_data": net_zero.get("graph_data", [])
            }
        }

        cache.set("uk_economy_dashboard_data", formatted_response, timeout=None)
        return "Superset Cache Successfully Rebuilt!"

    except Exception as exc:
        self.retry(exc=exc)
