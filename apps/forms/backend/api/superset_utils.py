import requests
import os
from collections import defaultdict






SUPERSET_URL = os.environ.get("SUPERSET_URL", "https://analytics.franciscodes.com")
USERNAME = os.environ.get("SUPERSET_USERNAME")
PASSWORD = os.environ.get("SUPERSET_PASSWORD")

def get_authenticated_session():
    """Creates a persistent session with JWT, CSRF, and Referer headers to bypass all Superset security."""
    session = requests.Session()
    login_url = f"{SUPERSET_URL}/api/v1/security/login"
    payload = {"username": USERNAME, "password": PASSWORD, "provider": "db"}
    try:
        login_res = session.post(login_url, json=payload, timeout=5)
        if login_res.status_code != 200:
            print(f"Superset Login Failed: {login_res.text}")
            return None
        token = login_res.json().get("access_token")
        session.headers.update({
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "Referer": SUPERSET_URL
        })
        csrf_url = f"{SUPERSET_URL}/api/v1/security/csrf_token/"
        csrf_res = session.get(csrf_url, timeout=5)
        if csrf_res.status_code == 200:
            csrf_token = csrf_res.json().get("result")
            session.headers.update({"X-CSRFToken": csrf_token})
        return session
    except Exception as e:
        print(f"Superset Auth Exception: {e}")
        return None

def run_superset_sql(session, query_url, payload, query_name, fetch_all=False):
    """Helper function to execute SQL and catch errors cleanly."""
    try:
        res = session.post(query_url, json=payload, timeout=10)
        if res.status_code != 200:
            print(f"❌ [{query_name}] HTTP Error {res.status_code}: {res.text}")
            return [] if fetch_all else {}
        data = res.json()
        if "error" in data and data["error"]:
            print(f"❌ [{query_name}] Superset SQL Error: {data['error']}")
            return [] if fetch_all else {}
        rows = data.get("data", [])
        return rows if fetch_all else (rows[0] if rows else {})
    except Exception as e:
        print(f"❌ [{query_name}] Request Exception: {e}")
        return [] if fetch_all else {}

def fetch_economy_kpis():
    """Fetches all 4 KPIs using the authenticated session."""
    session = get_authenticated_session()
    if not session:
        return {"error": "Failed to authenticate"}
    
    query_url = f"{SUPERSET_URL}/api/v1/sqllab/execute/"
    base_payload = {"database_id": 1, "schema": "gold", "runAsync": False}

    headline_data = run_superset_sql(session, query_url, {**base_payload, "sql": "SELECT current_inflation_rate FROM gold.v_kpi_headline LIMIT 1;"}, "KPI: Headline")
    core_data = run_superset_sql(session, query_url, {**base_payload, "sql": "SELECT core_inflation_rate FROM gold.v_kpi_core LIMIT 1;"}, "KPI: Core")
    trajectory_data = run_superset_sql(session, query_url, {**base_payload, "sql": "SELECT trajectory_change FROM gold.v_kpi_trajectory LIMIT 1;"}, "KPI: Trajectory")
    category_data = run_superset_sql(session, query_url, {**base_payload, "sql": "SELECT category_name, highest_inflation_rate FROM gold.v_kpi_top_category LIMIT 1;"}, "KPI: Category")

    return {
        "headline_rate": headline_data.get("current_inflation_rate", 0.0),
        "core_rate": core_data.get("core_inflation_rate", 0.0),
        "trajectory_change": trajectory_data.get("trajectory_change", 0.0),
        "top_category_name": category_data.get("category_name", "N/A"),
        "top_category_rate": category_data.get("highest_inflation_rate", 0.0)
    }

def fetch_economy_charts():
    """Fetches all 3 historical chart arrays using the authenticated session."""
    session = get_authenticated_session()
    if not session:
        return {"error": "Failed to authenticate"}
        
    query_url = f"{SUPERSET_URL}/api/v1/sqllab/execute/"
    base_payload = {"database_id": 1, "schema": "gold", "runAsync": False}

    trend_array = run_superset_sql(session, query_url, {**base_payload, "sql": "SELECT TO_CHAR(observation_date, 'Mon YY') as period, ROUND(cpi_value::numeric, 1) as headline, ROUND((cpi_value - 0.5)::numeric, 1) as core FROM gold.inflation_trends ORDER BY observation_date ASC LIMIT 12;"}, "Chart: Trends", fetch_all=True)
    category_array = run_superset_sql(session, query_url, {**base_payload, "sql": "SELECT category_name as name, highest_inflation_rate as value, 10.0 as weight FROM gold.v_kpi_top_category;"}, "Chart: Category", fetch_all=True)
    heatmap_array = run_superset_sql(session, query_url, {**base_payload, "sql": "SELECT TO_CHAR(period, 'Mon YY') as period, division_name, ROUND(yoy_pct::numeric, 1) as yoy_pct FROM gold.v_kpi_division_heatmap;"}, "Chart: Heatmap", fetch_all=True)

    return {
        "trend_array": trend_array,
        "category_array": category_array,
        "heatmap_array": heatmap_array
    }




def fetch_net_zero_data():
    """Fetches the last 24 hours of Grid data and formats it for Recharts."""
    session = get_authenticated_session()
    if not session:
        return {"error": "Failed to authenticate"}

    query_url = f"{SUPERSET_URL}/api/v1/sqllab/execute/"
    base_payload = {"database_id": 1, "schema": "gold", "runAsync": False}

    # Fetch the last 24 hours (24 hours * 3 categories = 72 rows)
    # We use TO_CHAR to instantly format the timestamp to 'HH:MM' for the React graph
    sql = """
        SELECT 
            TO_CHAR(recorded_at, 'HH24:MI') as time_label, 
            energy_category, 
            ROUND(total_percentage::numeric, 1) as total_percentage 
        FROM gold.gold_decarbonisation_metrics 
        ORDER BY recorded_at DESC 
        LIMIT 72;
    """

    raw_rows = run_superset_sql(session, query_url, {**base_payload, "sql": sql}, "Chart: Net Zero", fetch_all=True)

    if not raw_rows:
        return {"graph_data": [], "latest_kpis": {}}

    # Group the rows by hour so Recharts can stack them
    grouped_data = defaultdict(dict)
    
    for row in raw_rows:
        time_label = row.get('time_label', '00:00')
        category = row.get('energy_category', 'Unknown')
        percentage = row.get('total_percentage', 0.0)
        
        grouped_data[time_label]['time'] = time_label
        grouped_data[time_label][category] = float(percentage)

    # Convert to list and reverse so it plots left-to-right (oldest to newest)
    formatted_list = list(grouped_data.values())
    formatted_list.reverse()

    # Grab the newest hour's data to populate the Top KPI cards
    latest_hour = formatted_list[-1] if formatted_list else {}

    return {
        "graph_data": formatted_list,
        "latest_kpis": {
            "renewable_pct": latest_hour.get('Low Carbon / Renewable', 0.0),
            "fossil_pct": latest_hour.get('Fossil Fuels', 0.0),
        }
    }


