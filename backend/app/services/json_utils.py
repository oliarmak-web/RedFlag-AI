import json
from typing import Any


def parse_model_json(raw_text: str) -> dict[str, Any]:
    text = raw_text.strip()

    if "```" in text:
        text = text.replace("```json", "").replace("```", "").strip()

    # Handle occasional prefixed/suffixed text.
    first = text.find("{")
    last = text.rfind("}")
    if first >= 0 and last > first:
        text = text[first : last + 1]

    return json.loads(text)
