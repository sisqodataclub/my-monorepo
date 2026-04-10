import requests
import os

# Set these in your environment variables, or hardcode them for testing
SUPERSET_URL = os.environ.get("SUPERSET_URL", "https://analytics.franciscodes.com")
USERNAME = os.environ.get("SUPERSET_USERNAME")
PASSWORD = os.environ.get("SUPERSET_PASSWORD")

def get_superset_token():
    """Logs into Superset and returns the JWT Bearer token."""
    login_url = f"{SUPERSET_URL}/api/v1/security/login"
    payload = {
        "username": USERNAME,
        "password": PASSWORD,
        "provider": "db"
    }

    try:
        response = requests.post(login_url, json=payload, timeout=5)
        if response.status_code == 200:
            return response.json().get("access_token")
    except requests.exceptions.RequestException as e:
        print(f"Superset Login Error: {e}")

    return None

def fetch_economy_kpis():
    """Fetches the 3 KPIs via Superset's SQL Lab API."""
    token = get_superset_token()
    if not token:
        return {"error": "Failed to authenticate with Superset"}

    headers = {"Authorization": f"Bearer {token}"}

    sql_payload = {
        "client_id": "django_react_frontend_kpis",
        "database_id": 1,
        "schema": "gold",
        "sql": """
            SELECT
                (SELECT current_inflation_rate FROM gold.v_kpi_headline) as headline_rate,
                (SELECT trajectory_change FROM gold.v_kpi_trajectory) as trajectory_change,
                (SELECT category_name FROM gold.v_kpi_top_category) as top_category_name,
                (SELECT highest_inflation_rate FROM gold.v_kpi_top_category) as top_category_rate;
        """
    }

    query_url = f"{SUPERSET_URL}/api/v1/sqllab/execute/"

    try:
        response = requests.post(query_url, json=sql_payload, headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json().get("data", [])
            if data:
                return data[0] # Return the clean JSON row
    except requests.exceptions.RequestException as e:
        print(f"Superset KPI Query Error: {e}")

    return {"error": "Failed to fetch KPI data from Superset"}

def fetch_economy_charts():
    """Fetches the historical chart data for Recharts."""
    token = get_superset_token()
    if not token:
        return {"error": "Failed to authenticate with Superset"}

    headers = {"Authorization": f"Bearer {token}"}

    # We use JSON_AGG to format the array perfectly for Recharts
    sql_payload = {
        "client_id": "django_react_charts",
        "database_id": 1, 
        "schema": "gold",
        "sql": """
            WITH trend_data AS (
                SELECT 
                    TO_CHAR(observation_date, 'Mon YY') as period,
                    ROUND(cpi_value::numeric, 1) as headline,
                    ROUND((cpi_value - 0.5)::numeric, 1) as core
                FROM gold.inflation_trends
                ORDER BY observation_date ASC
                LIMIT 12
            ),
            category_data AS (
                SELECT 
                    category_name as name,
                    highest_inflation_rate as value,
                    10.0 as weight
                FROM gold.v_kpi_top_category
            )
            SELECT 
                (SELECT json_agg(row_to_json(trend_data)) FROM trend_data) as trend_array,
                (SELECT json_agg(row_to_json(category_data)) FROM category_data) as category_array;
        """
    }

    query_url = f"{SUPERSET_URL}/api/v1/sqllab/execute/"
    
    try:
        response = requests.post(query_url, json=sql_payload, headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json().get("data", [])
            if data:
                return data[0]
    except requests.exceptions.RequestException as e:
        print(f"Superset Chart Query Error: {e}")

    return {"error": "Failed to fetch chart data"}
