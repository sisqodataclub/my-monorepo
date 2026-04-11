import requests
import os

SUPERSET_URL = os.environ.get("SUPERSET_URL", "https://analytics.franciscodes.com")
USERNAME = os.environ.get("SUPERSET_USERNAME")
PASSWORD = os.environ.get("SUPERSET_PASSWORD")

def get_authenticated_session():
    """Creates a persistent session with JWT, CSRF, and Referer headers to bypass all Superset security."""
    session = requests.Session()
    
    login_url = f"{SUPERSET_URL}/api/v1/security/login"
    payload = {"username": USERNAME, "password": PASSWORD, "provider": "db"}

    try:
        # 1. Login to get JWT and Session Cookie
        login_res = session.post(login_url, json=payload, timeout=5)
        if login_res.status_code != 200:
            print(f"Superset Login Failed: {login_res.text}")
            return None
            
        token = login_res.json().get("access_token")
        
        # Add the JWT and Spoofed Referer to the session headers
        session.headers.update({
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "Referer": SUPERSET_URL
        })

        # 2. Fetch CSRF Token
        csrf_url = f"{SUPERSET_URL}/api/v1/security/csrf_token/"
        csrf_res = session.get(csrf_url, timeout=5)
        
        if csrf_res.status_code == 200:
            csrf_token = csrf_res.json().get("result")
            session.headers.update({"X-CSRFToken": csrf_token})
        else:
            print(f"CSRF Fetch Failed: {csrf_res.text}")
            
        return session

    except Exception as e:
        print(f"Superset Auth Exception: {e}")
        return None


def fetch_economy_kpis():
    """Fetches the 3 KPIs using the authenticated session."""
    session = get_authenticated_session()
    if not session:
        return {"error": "Failed to authenticate"}

    query_url = f"{SUPERSET_URL}/api/v1/sqllab/execute/"
    base_payload = {"database_id": 1, "schema": "gold", "runAsync": False}

    try:
        # 1. Fetch Headline
        h_payload = {**base_payload, "sql": "SELECT current_inflation_rate FROM gold.v_kpi_headline LIMIT 1;"}
        h_res = session.post(query_url, json=h_payload, timeout=5)
        headline_data = h_res.json().get("data", [{}])[0] if h_res.status_code == 200 else {}

        # 2. Fetch Trajectory
        t_payload = {**base_payload, "sql": "SELECT trajectory_change FROM gold.v_kpi_trajectory LIMIT 1;"}
        t_res = session.post(query_url, json=t_payload, timeout=5)
        trajectory_data = t_res.json().get("data", [{}])[0] if t_res.status_code == 200 else {}

        # 3. Fetch Category
        c_payload = {**base_payload, "sql": "SELECT category_name, highest_inflation_rate FROM gold.v_kpi_top_category LIMIT 1;"}
        c_res = session.post(query_url, json=c_payload, timeout=5)
        category_data = c_res.json().get("data", [{}])[0] if c_res.status_code == 200 else {}

        return {
            "headline_rate": headline_data.get("current_inflation_rate", 0.0),
            "trajectory_change": trajectory_data.get("trajectory_change", 0.0),
            "top_category_name": category_data.get("category_name", "N/A"),
            "top_category_rate": category_data.get("highest_inflation_rate", 0.0)
        }

    except Exception as e:
        print(f"KPI Exec Error: {e}")
        return {"error": str(e)}


def fetch_economy_charts():
    """Fetches the historical chart arrays using the authenticated session."""
    session = get_authenticated_session()
    if not session:
        return {"error": "Failed to authenticate"}

    query_url = f"{SUPERSET_URL}/api/v1/sqllab/execute/"
    base_payload = {"database_id": 1, "schema": "gold", "runAsync": False}

    sql_trend = {**base_payload, "sql": "SELECT TO_CHAR(observation_date, 'Mon YY') as period, ROUND(cpi_value::numeric, 1) as headline, ROUND((cpi_value - 0.5)::numeric, 1) as core FROM gold.inflation_trends ORDER BY observation_date ASC LIMIT 12;"}
    sql_category = {**base_payload, "sql": "SELECT category_name as name, highest_inflation_rate as value, 10.0 as weight FROM gold.v_kpi_top_category;"}
    
    try:
        trend_response = session.post(query_url, json=sql_trend, timeout=10)
        trend_array = trend_response.json().get("data", []) if trend_response.status_code == 200 else []

        category_response = session.post(query_url, json=sql_category, timeout=10)
        category_array = category_response.json().get("data", []) if category_response.status_code == 200 else []

        return {
            "trend_array": trend_array,
            "category_array": category_array
        }

    except Exception as e:
        print(f"Chart Exec Error: {e}")
        return {"error": str(e)}
