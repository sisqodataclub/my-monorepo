import requests
import queue
import threading
import time
import logging
from django.http import StreamingHttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response

logger = logging.getLogger(__name__)

AI_API_URL = "https://aiapi.franciscodes.com"


@api_view(['POST'])
def analyze_cv(request):
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
        response = requests.post(
            f"{AI_API_URL}/missions/start",
            json={"mission": mission}
        )
        response.raise_for_status()
        task_id = response.json().get("task_id")
        return Response({"task_id": task_id, "status": "Mission started"})
    except requests.exceptions.RequestException as e:
        return Response({"error": str(e)}, status=500)


def stream_mission(request, task_id):
    """
    Stream the progress of a mission from the AI API with aggressive keep‑alive padding.
    Uses a background thread to fetch from the orchestrator while the main thread sends
    continuous padding to overflow proxy buffers and keep the connection alive.
    """
    def event_stream():
        # 1. Heavy initial padding (8KB) – instantly flushes proxy buffers so Cloudflare
        #    sees the connection as active.
        heavy_padding = ":" + (" " * 8192) + "\n\n"
        yield f'data: {{"event": "connected"}}\n\n{heavy_padding}'

        url = f"{AI_API_URL}/missions/{task_id}/stream"
        q = queue.Queue()
        stop_event = threading.Event()

        def fetch_stream():
            """Background thread that reads from the orchestrator and puts data into the queue."""
            try:
                # Use a very long read timeout (600 seconds = 10 minutes) because the AI can be slow.
                with requests.get(
                    url,
                    stream=True,
                    headers={"Accept": "text/event-stream"},
                    timeout=(5, 600)
                ) as resp:
                    resp.raise_for_status()
                    for chunk in resp.iter_content(chunk_size=None, decode_unicode=True):
                        if stop_event.is_set():
                            break
                        if chunk:
                            q.put(("data", chunk))
                    q.put(("done", None))
            except Exception as e:
                q.put(("error", str(e)))

        # Start the background thread
        t = threading.Thread(target=fetch_stream, daemon=True)
        t.start()

        last_heartbeat = time.time()

        try:
            while True:
                try:
                    # Wait up to 2 seconds for new data from the orchestrator
                    msg_type, content = q.get(timeout=2)

                    if msg_type == "data":
                        yield content
                    elif msg_type == "done":
                        break
                    elif msg_type == "error":
                        yield f'data: {{"error": "{content}"}}\n\n'
                        break

                except queue.Empty:
                    # 2. Continuous 2KB padding – sends an invisible SSE comment every 2 seconds.
                    # This guarantees that data flows over the wire, resetting Cloudflare's timeout.
                    yield f": ping {' ' * 2048}\n\n"

                    # Send a user‑friendly heartbeat every 15 seconds if the AI is silent.
                    if time.time() - last_heartbeat > 15:
                        yield f'data: {{"event": "heartbeat", "message": "AI is deeply analyzing..."}}\n\n'
                        last_heartbeat = time.time()

        finally:
            stop_event.set()  # Signal the background thread to stop

    response = StreamingHttpResponse(event_stream(), content_type="text/event-stream")
    response["Cache-Control"] = "no-cache"
    response["X-Accel-Buffering"] = "no"   # Nginx: disable buffering
    response["Access-Control-Allow-Origin"] = "https://www.franciscodes.com"
    response["Access-Control-Allow-Credentials"] = "true"
    return response


@api_view(['GET'])
def fetch_cv_report(request, task_id):
    """
    Fetch the final cv_report.json artifact from the AI orchestrator.
    """
    try:
        target_filename = "cv_report.json"
        response = requests.get(
            f"{AI_API_URL}/missions/{task_id}/artifacts/{target_filename}"
        )
        response.raise_for_status()
        return Response(response.json())
    except requests.exceptions.RequestException as e:
        return Response(
            {"error": "Report not ready or failed to generate", "details": str(e)},
            status=404
        )
