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
    """Fetches the 3 KPIs using safe, flat queries to bypass Superset's subquery restrictions."""
    token = get_superset_token()
    if not token:
        return {"error": "Failed to authenticate with Superset"}

    headers = {"Authorization": f"Bearer {token}"}
    query_url = f"{SUPERSET_URL}/api/v1/sqllab/execute/"
    
    base_payload = {
        "database_id": 1,
        "schema": "gold"
    }

    try:
        # 1. Fetch Headline
        h_payload = {**base_payload, "client_id": "kpi_headline", "sql": "SELECT current_inflation_rate FROM gold.v_kpi_headline LIMIT 1;"}
        h_res = requests.post(query_url, json=h_payload, headers=headers, timeout=5)
        headline_data = h_res.json().get("data", [{}])[0] if h_res.status_code == 200 else {}

        # 2. Fetch Trajectory
        t_payload = {**base_payload, "client_id": "kpi_trajectory", "sql": "SELECT trajectory_change FROM gold.v_kpi_trajectory LIMIT 1;"}
        t_res = requests.post(query_url, json=t_payload, headers=headers, timeout=5)
        trajectory_data = t_res.json().get("data", [{}])[0] if t_res.status_code == 200 else {}

        # 3. Fetch Category
        c_payload = {**base_payload, "client_id": "kpi_category", "sql": "SELECT category_name, highest_inflation_rate FROM gold.v_kpi_top_category LIMIT 1;"}
        c_res = requests.post(query_url, json=c_payload, headers=headers, timeout=5)
        category_data = c_res.json().get("data", [{}])[0] if c_res.status_code == 200 else {}

        # Combine into the exact format views.py expects!
        return {
            "headline_rate": headline_data.get("current_inflation_rate", 0.0),
            "trajectory_change": trajectory_data.get("trajectory_change", 0.0),
            "top_category_name": category_data.get("category_name", "N/A"),
            "top_category_rate": category_data.get("highest_inflation_rate", 0.0)
        }

    except Exception as e:
        print(f"Superset KPI Query Error: {e}")
        return {"error": str(e)}


def fetch_economy_charts():
    """Fetches the historical chart data for Recharts."""
    token = get_superset_token()
    if not token:
        return {"error": "Failed to authenticate with Superset"}

    headers = {"Authorization": f"Bearer {token}"}
    query_url = f"{SUPERSET_URL}/api/v1/sqllab/execute/"

    # 1. Ask for flat Trend Data
    sql_trend = {
        "client_id": "django_trend_data",
        "database_id": 1, 
        "schema": "gold",
        "sql": """
            SELECT 
                TO_CHAR(observation_date, 'Mon YY') as period,
                ROUND(cpi_value::numeric, 1) as headline,
                ROUND((cpi_value - 0.5)::numeric, 1) as core
            FROM gold.inflation_trends
            ORDER BY observation_date ASC
            LIMIT 12;
        """
    }

    # 2. Ask for flat Category Data
    sql_category = {
        "client_id": "django_category_data",
        "database_id": 1, 
        "schema": "gold",
        "sql": """
            SELECT 
                category_name as name,
                highest_inflation_rate as value,
                10.0 as weight
            FROM gold.v_kpi_top_category;
        """
    }
    
    try:
        # Fetch Trends
        trend_response = requests.post(query_url, json=sql_trend, headers=headers, timeout=10)
        trend_array = trend_response.json().get("data", []) if trend_response.status_code == 200 else []

        # Fetch Categories
        category_response = requests.post(query_url, json=sql_category, headers=headers, timeout=10)
        category_array = category_response.json().get("data", []) if category_response.status_code == 200 else []

        # Return the two arrays cleanly formatted for React!
        return {
            "trend_array": trend_array,
            "category_array": category_array
        }

    except requests.exceptions.RequestException as e:
        print(f"Superset Chart Query Error: {e}")

    return {"error": "Failed to fetch chart data"}
