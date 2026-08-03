import requests
from django.http import StreamingHttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response

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
    Stream the progress of a mission from the AI API.
    Returns Server‑Sent Events (SSE) – must be a regular Django view, not a DRF view.
    """
    def event_stream():
        # Send an immediate "connected" ping to flush headers and keep the connection alive.
        yield 'data: {"event": "connected"}\n\n'

        url = f"{AI_API_URL}/missions/{task_id}/stream"
        try:
            # Timeout tuple: (connect_timeout, read_timeout)
            # Connect timeout ensures we don't hang if the orchestrator is unreachable.
            # Read timeout is None because SSE streams indefinitely.
            with requests.get(
                url,
                stream=True,
                headers={"Accept": "text/event-stream"},
                timeout=(5, None)
            ) as resp:
                resp.raise_for_status()
                # chunk_size=None forces unbuffered streaming – no byte hoarding.
                for chunk in resp.iter_content(chunk_size=None, decode_unicode=True):
                    if chunk:
                        yield chunk
        except requests.exceptions.RequestException as e:
            # Format errors as valid SSE so the frontend can handle them.
            yield f'data: {{"error": "{str(e)}"}}\n\n'

    response = StreamingHttpResponse(event_stream(), content_type="text/event-stream")
    response["Cache-Control"] = "no-cache"
    response["X-Accel-Buffering"] = "no"   # Prevent Nginx from buffering
    # Explicit CORS headers (fallback if middleware doesn't add them)
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
