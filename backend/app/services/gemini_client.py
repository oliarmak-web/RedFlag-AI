from __future__ import annotations

from typing import Any

from fastapi import HTTPException
from google import genai
from google.genai import types

from app.config import settings
from app.models import AnalysisResponse, StoryResponse
from app.prompts import build_analysis_prompt, build_story_prompt
from app.services.json_utils import parse_model_json


class GeminiService:
    def __init__(self) -> None:
        if not settings.gemini_api_key:
            raise HTTPException(status_code=500, detail="Missing GEMINI_API_KEY environment variable.")

        self.client = genai.Client(api_key=settings.gemini_api_key)
        self.model = settings.gemini_model

    def _generate_json(self, contents: Any) -> dict[str, Any]:
        response = self.client.models.generate_content(
            model=self.model,
            contents=contents,
            config=types.GenerateContentConfig(
                temperature=0.2,
                response_mime_type="application/json",
            ),
        )

        if not response.text:
            raise HTTPException(status_code=502, detail="Gemini returned an empty response.")

        try:
            return parse_model_json(response.text)
        except Exception as exc:
            raise HTTPException(status_code=502, detail=f"Failed to parse model JSON: {exc}") from exc

    def analyze_text(self, text: str) -> AnalysisResponse:
        data = self._generate_json(build_analysis_prompt(text))
        return AnalysisResponse(**data)

    def analyze_link(self, url: str) -> AnalysisResponse:
        prompt = build_analysis_prompt(f"Analyze this suspicious URL: {url}")
        data = self._generate_json(prompt)
        return AnalysisResponse(**data)

    def analyze_image(self, image_bytes: bytes, mime_type: str) -> AnalysisResponse:
        prompt = build_analysis_prompt(
            "Analyze the attached screenshot/image for suspicious patterns (phishing, fake profiles, QR traps, urgency cues)."
        )

        contents = [
            prompt,
            types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
        ]
        data = self._generate_json(contents)
        return AnalysisResponse(**data)

    def generate_story(self, summary: str, signals: list[str], risk_level: str) -> StoryResponse:
        data = self._generate_json(build_story_prompt(summary=summary, signals=signals, risk_level=risk_level))
        return StoryResponse(**data)
