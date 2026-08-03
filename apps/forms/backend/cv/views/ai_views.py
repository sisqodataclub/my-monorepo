import requests
import logging
import threading
import queue
import time
from django.http import StreamingHttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response

logger = logging.getLogger(__name__)
AI_API_URL = "https://aiapi.franciscodes.com"


@api_view(['POST'])
def analyze_cv(request):
    # [Keep this exactly as you currently have it]
    resume_data = request.data.get('resume_data')
    if not resume_data:
        return Response({"error": "No CV data provided"}, status=400)

    mission = f"""
    Review the following CV and provide comprehensive feedback on content, structure, and impact.
    You MUST save your final output as a file named exactly 'cv_report.json' in your scratch directory.
    Output a structured JSON report with:
    - "rating": an overall score from 1 to 10,
    - "strengths": a list of key strengths,
    - "weaknesses": a list of areas for improvement,
    - "suggestions": actionable recommendations for each section.

    CV Content:
    {resume_data}
    """

    try:
        response = requests.post(f"{AI_API_URL}/missions/start", json={"mission": mission})
        response.raise_for_status()
        task_id = response.json().get("task_id")
        return Response({"task_id": task_id, "status": "Mission started"})
    except requests.exceptions.RequestException as e:
        return Response({"error": str(e)}, status=500)


def stream_mission(request, task_id):
    def event_stream():
        # 1. 1KB Padding trick: Overflows Nginx/Cloudflare buffers to force immediate network delivery
        padding = ":" + (" " * 1024) + "\n\n"
        
        # Instantly ping the frontend
        yield f'data: {{"event": "connected"}}\n\n{padding}'

        url = f"{AI_API_URL}/missions/{task_id}/stream"
        q = queue.Queue()
        stop_event = threading.Event()

        def fetch_stream():
            try:
                # 600s timeout allows the AI up to 10 minutes to process the massive prompt
                with requests.get(url, stream=True, timeout=(5, 600), headers={"Accept": "text/event-stream"}) as resp:
                    resp.raise_for_status()
                    for chunk in resp.iter_content(chunk_size=None, decode_unicode=True):
                        if stop_event.is_set():
                            break
                        if chunk:
                            q.put(("data", chunk))
                    q.put(("done", None))
            except Exception as e:
                q.put(("error", str(e)))

        t = threading.Thread(target=fetch_stream, daemon=True)
        t.start()

        last_heartbeat = time.time()
        try:
            while True:
                try:
                    # 2. Fast Yield: 2-second timeout allows Django to hit 'yield' frequently.
                    # This prevents the "took too long to shut down" Daphne crash if the client disconnects.
                    msg_type, content = q.get(timeout=2)
                    
                    if msg_type == "data":
                        yield content
                    elif msg_type == "done":
                        break
                    elif msg_type == "error":
                        yield f'data: {{"error": "{content}"}}\n\n'
                        break

                except queue.Empty:
                    # Ping an invisible comment to check if the browser disconnected
                    yield ": ping\n\n"
                    
                    # 3. Padded Heartbeat: Sent every 15 seconds to bypass Cloudflare's 100s kill switch
                    if time.time() - last_heartbeat > 15:
                        yield f'data: {{"event": "heartbeat", "message": "AI is deeply analyzing..."}}\n\n{padding}'
                        last_heartbeat = time.time()

        finally:
            stop_event.set()

    response = StreamingHttpResponse(event_stream(), content_type="text/event-stream")
    response["Cache-Control"] = "no-cache"
    response["X-Accel-Buffering"] = "no"
    response["Access-Control-Allow-Origin"] = "https://www.franciscodes.com"
    response["Access-Control-Allow-Credentials"] = "true"
    return response


@api_view(['GET'])
def fetch_cv_report(request, task_id):
    # [Keep this exactly as you currently have it]
    try:
        target_filename = "cv_report.json"
        response = requests.get(f"{AI_API_URL}/missions/{task_id}/artifacts/{target_filename}")
        response.raise_for_status()
        return Response(response.json())
    except requests.exceptions.RequestException as e:
        return Response({"error": "Report not ready or failed", "details": str(e)}, status=404)
