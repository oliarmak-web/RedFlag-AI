from fastapi import APIRouter

from app.models import StoryRequest, StoryResponse
from app.services.gemini_client import GeminiService

router = APIRouter(tags=["story"])


@router.post("/generate-story", response_model=StoryResponse)
def generate_story(payload: StoryRequest) -> StoryResponse:
    return GeminiService().generate_story(
        summary=payload.summary,
        signals=payload.signals_detected,
        risk_level=payload.risk_level,
    )
