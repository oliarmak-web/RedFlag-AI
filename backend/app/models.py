from typing import List

from pydantic import BaseModel, Field, HttpUrl


class TextAnalysisRequest(BaseModel):
    text: str = Field(min_length=3, max_length=12000)


class LinkAnalysisRequest(BaseModel):
    url: HttpUrl


class AnalysisResponse(BaseModel):
    risk_level: str
    summary: str
    signals_detected: List[str]
    guidance: List[str]
    confidence_note: str


class StoryRequest(BaseModel):
    summary: str = Field(min_length=3, max_length=4000)
    signals_detected: List[str]
    risk_level: str


class StoryResponse(BaseModel):
    title: str
    short_story: str
    red_flags_spotted: List[str]
    lesson_learned: str
