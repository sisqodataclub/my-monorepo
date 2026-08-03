# cv/views/ai_views.py
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import StreamingHttpResponse

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

    # Write a clear, detailed mission – the orchestrator will generate its own agents.
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
        # No 'agents' field – let the orchestrator decide.
        response = requests.post(
            f"{AI_API_URL}/missions/start",
            json={"mission": mission}
        )
        response.raise_for_status()
        task_id = response.json().get("task_id")
        return Response({"task_id": task_id, "status": "Mission started"})
    except requests.exceptions.RequestException as e:
        return Response({"error": str(e)}, status=500)


@api_view(['GET'])
def stream_mission(request, task_id):
    """
    Stream the progress and result of a mission.
    Returns Server‑Sent Events (SSE).
    """
    def event_stream():
        stream_url = f"{AI_API_URL}/missions/{task_id}/stream"
        with requests.get(stream_url, stream=True) as response:
            for line in response.iter_lines():
                if line:
                    yield f"data: {line.decode('utf-8')}\n\n"

    return StreamingHttpResponse(event_stream(), content_type='text/event-stream')


@api_view(['GET'])
def fetch_cv_report(request, task_id):
    """
    Fetch the final cv_report.json artifact from the AI orchestrator.
    Returns the JSON report directly.
    """
    try:
        response = requests.get(f"{AI_API_URL}/missions/{task_id}/artifact")
        response.raise_for_status()
        return Response(response.json())
    except requests.exceptions.RequestException as e:
        return Response(
            {"error": "Report not ready or failed to generate", "details": str(e)},
            status=404
        )
