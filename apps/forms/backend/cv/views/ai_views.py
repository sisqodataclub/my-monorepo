# cv/views/ai_views.py
import requests
from django.http import StreamingHttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response

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
    Stream the progress of a mission from the AI API with Keep-Alive Heartbeats.
    """
    def event_stream():
        # Immediate ping to flush headers and keep connection alive
        yield 'data: {"event": "connected"}\n\n'

        url = f"{AI_API_URL}/missions/{task_id}/stream"
        try:
            # Create a session with a 15‑second read timeout.
            # If the AI is silent for longer than that, we catch the ReadTimeout
            # and send a heartbeat to the client, resetting Nginx's timeout.
            session = requests.Session()
            req = requests.Request('GET', url, headers={"Accept": "text/event-stream"}).prepare()
            resp = session.send(req, stream=True, timeout=(5, 15))  # 5s connect, 15s read
            resp.raise_for_status()

            while True:
                try:
                    # Iterate over lines – this will block until a line is received
                    # or the read timeout is reached.
                    for line in resp.iter_lines(decode_unicode=True):
                        if line:
                            # Forward the raw SSE line as-is
                            yield f"{line}\n\n"
                    # If we exit the loop, the stream ended naturally
                    break
                except requests.exceptions.ReadTimeout:
                    # No data received for 15 seconds – send a heartbeat
                    yield 'data: {"event": "heartbeat", "message": "AI is still thinking..."}\n\n'
                    # Continue the loop to keep listening
                    continue
        except requests.exceptions.RequestException as e:
            yield f'data: {{"error": "{str(e)}"}}\n\n'

    response = StreamingHttpResponse(event_stream(), content_type="text/event-stream")
    response["Cache-Control"] = "no-cache"
    response["X-Accel-Buffering"] = "no"   # Disable Nginx buffering
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
