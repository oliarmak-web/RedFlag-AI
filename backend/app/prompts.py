ANALYSIS_SCHEMA = {
    "risk_level": "Low | Medium | High",
    "summary": "short plain-language summary",
    "signals_detected": ["signal 1", "signal 2", "signal 3"],
    "guidance": ["safe next step 1", "safe next step 2"],
    "confidence_note": "brief note",
}

STORY_SCHEMA = {
    "title": "story title",
    "short_story": "short educational narrative showing how the scam or manipulation could unfold",
    "red_flags_spotted": ["red flag 1", "red flag 2"],
    "lesson_learned": "short takeaway",
}

ANALYSIS_PROMPT_TEMPLATE = """
You are RedFlag AI, a safety-focused scam detection assistant.

Task:
Analyze suspicious user-provided digital content and detect likely scam, phishing, impersonation, or manipulation indicators.

Possible content types:
- text messages and emails
- suspicious links and domains
- profile screenshots
- QR code screenshots
- social profile descriptions
- voice-cloning style transcripts

Focus on these cues:
- phishing patterns
- impersonation signals
- fake profile indicators
- suspicious domain clues
- urgency/authority pressure language
- manipulation tactics
- possible AI voice-cloning scam cues when transcript-like content is present

Return ONLY valid JSON with this exact shape:
{schema}

Rules:
- risk_level must be exactly one of: Low, Medium, High
- Keep language practical, concise, user-friendly
- Guidance must be safe next actions users can perform immediately
- Do not provide legal, medical, or mental health advice
- No markdown, no extra commentary, no code fences

User content:
{content}
""".strip()

STORY_PROMPT_TEMPLATE = """
You are RedFlag AI's educational storyteller.

Based on the analysis context, generate a concise educational story that demonstrates how a scam or manipulation attempt could unfold.

Return ONLY valid JSON with this exact shape:
{schema}

Rules:
- Keep the story short, practical, and realistic
- Keep tone educational, not sensational
- Highlight scam pattern recognition
- No markdown, no extra commentary, no code fences

Analysis context:
- Risk level: {risk_level}
- Summary: {summary}
- Signals: {signals}
""".strip()


def build_analysis_prompt(content: str) -> str:
    return ANALYSIS_PROMPT_TEMPLATE.format(schema=ANALYSIS_SCHEMA, content=content)


def build_story_prompt(summary: str, signals: list[str], risk_level: str) -> str:
    return STORY_PROMPT_TEMPLATE.format(
        schema=STORY_SCHEMA,
        summary=summary,
        signals=", ".join(signals),
        risk_level=risk_level,
    )
