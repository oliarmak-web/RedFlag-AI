from fastapi import APIRouter, File, HTTPException, UploadFile

from app.models import AnalysisResponse, LinkAnalysisRequest, TextAnalysisRequest
from app.services.gemini_client import GeminiService

router = APIRouter(tags=["analysis"])


@router.post("/analyze-text", response_model=AnalysisResponse)
def analyze_text(payload: TextAnalysisRequest) -> AnalysisResponse:
    return GeminiService().analyze_text(payload.text)


@router.post("/analyze-link", response_model=AnalysisResponse)
def analyze_link(payload: LinkAnalysisRequest) -> AnalysisResponse:
    return GeminiService().analyze_link(str(payload.url))


@router.post("/analyze-image", response_model=AnalysisResponse)
async def analyze_image(file: UploadFile = File(...)) -> AnalysisResponse:
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Please upload an image file.")

    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Uploaded image is empty.")

    return GeminiService().analyze_image(image_bytes=image_bytes, mime_type=file.content_type)
