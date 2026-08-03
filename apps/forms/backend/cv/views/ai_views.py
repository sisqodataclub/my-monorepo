import requests
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
    Stream the progress of a mission from the AI API with Keep-Alive Heartbeats.
    """
    def event_stream():
        # Immediate ping
        yield 'data: {"event": "connected"}\n\n'

        url = f"{AI_API_URL}/missions/{task_id}/stream"
        logger.info(f"Starting stream for task {task_id}")

        try:
            session = requests.Session()
            req = requests.Request('GET', url, headers={"Accept": "text/event-stream"}).prepare()
            resp = session.send(req, stream=True, timeout=(5, 15))  # 5s connect, 15s read
            resp.raise_for_status()
            logger.info(f"Connected to orchestrator for task {task_id}")

            while True:
                try:
                    chunk_count = 0
                    for line in resp.iter_lines(decode_unicode=True):
                        if line:
                            chunk_count += 1
                            logger.debug(f"Received chunk #{chunk_count}: {line[:80]}...")
                            yield f"{line}\n\n"
                    logger.info(f"Stream for task {task_id} ended naturally after {chunk_count} chunks")
                    break
                except requests.exceptions.ReadTimeout:
                    logger.info(f"Read timeout for task {task_id} – sending heartbeat")
                    yield 'data: {"event": "heartbeat", "message": "AI is still thinking..."}\n\n'
                    continue
        except requests.exceptions.RequestException as e:
            logger.error(f"Stream error for task {task_id}: {str(e)}")
            yield f'data: {{"error": "{str(e)}"}}\n\n'

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
