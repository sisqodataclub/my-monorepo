import os
from google.cloud import bigquery

def fetch_ga4_funnel():
    """
    Connects to Google BigQuery, pulls the GA4 e-commerce funnel,
    and formats it for the React dashboard.
    """
    # Note: Ensure GOOGLE_APPLICATION_CREDENTIALS is set in your .env
    project_id = os.getenv("BIGQUERY_PROJECT_ID")
    
    try:
        # The client automatically uses your mounted service account JSON key
        client = bigquery.Client(project=project_id)
        
        query = """
            SELECT 
                event_name,
                COUNT(DISTINCT user_pseudo_id) as unique_users
            FROM 
                `bigquery-public-data.ga4_obfuscated_sample_ecommerce.events_*`
            WHERE 
                event_name IN ('session_start', 'view_item', 'add_to_cart', 'begin_checkout', 'purchase')
            GROUP BY 
                event_name
            ORDER BY 
                unique_users DESC;
        """
        
        # Execute the query
        query_job = client.query(query)
        results = query_job.result()
        
        # Format the rows into a clean dictionary list
        data = [{"event_name": row.event_name, "unique_users": row.unique_users} for row in results]
            
        return {
            "status": "success",
            "data": data
        }
        
    except Exception as e:
        print(f"❌ BigQuery Error: {e}")
        return {"status": "error", "message": str(e)}
