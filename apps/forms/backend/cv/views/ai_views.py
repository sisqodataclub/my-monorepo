# cv/views/ai_views.py
import requests
import logging
import threading
import queue
from django.http import StreamingHttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response

logger = logging.getLogger(__name__)

AI_API_URL = "https://aiapi.franciscodes.com"


@api_view(['POST'])
def analyze_cv(request):
    """
    Start an AI mission to analyse a CV.
    Expects JSON: {"resume_data": "..."} (the full CV content)
    """
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
    Stream the progress of a mission using a background thread and queue
    to guarantee non-destructive heartbeats.
    """
    def event_stream():
        # 1. Instantly ping the frontend to keep the initial connection open
        yield 'data: {"event": "connected"}\n\n'

        url = f"{AI_API_URL}/missions/{task_id}/stream"
        q = queue.Queue()
        stop_event = threading.Event()

        def fetch_stream():
            try:
                # We give the AI up to 10 minutes (600s) to think without timing out the backend request
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

        # 2. Start the AI listener in a background thread
        t = threading.Thread(target=fetch_stream, daemon=True)
        t.start()

        # 3. Main loop: wait for data from the queue or yield heartbeats
        try:
            while True:
                try:
                    # Wait up to 15 seconds for the AI to send a log
                    msg_type, content = q.get(timeout=15)

                    if msg_type == "data":
                        yield content
                    elif msg_type == "done":
                        break
                    elif msg_type == "error":
                        yield f'data: {{"error": "{content}"}}\n\n'
                        break

                except queue.Empty:
                    # 15 seconds passed and the AI is still thinking.
                    # Send a heartbeat to keep Nginx/Cloudflare from closing the connection!
                    yield 'data: {"event": "heartbeat", "message": "AI is deeply analyzing..."}\n\n'

        finally:
            # If the user closes the browser window, signal the thread to stop
            stop_event.set()

    response = StreamingHttpResponse(event_stream(), content_type="text/event-stream")
    response["Cache-Control"] = "no-cache"
    response["X-Accel-Buffering"] = "no"
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
        response = requests.get(f"{AI_API_URL}/missions/{task_id}/artifacts/{target_filename}")
        response.raise_for_status()
        return Response(response.json())
    except requests.exceptions.RequestException as e:
        return Response(
            {"error": "Report not ready or failed to generate", "details": str(e)},
            status=404
        )
