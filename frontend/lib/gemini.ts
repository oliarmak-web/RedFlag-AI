import { GoogleGenAI } from "@google/genai";

import { AnalysisResult, StoryResult } from "./types";

type GeminiContents =
  | string
  | Array<
      | {
          text: string;
        }
      | {
          inlineData: {
            data: string;
            mimeType: string;
          };
        }
    >;

const ANALYSIS_SCHEMA = {
  risk_level: "Low | Medium | High",
  summary: "short plain-language summary",
  signals_detected: ["signal 1", "signal 2", "signal 3"],
  guidance: ["safe next step 1", "safe next step 2"],
  confidence_note: "brief note",
};

const STORY_SCHEMA = {
  title: "story title",
  short_story:
    "short educational narrative showing how the scam or manipulation could unfold",
  red_flags_spotted: ["red flag 1", "red flag 2"],
  lesson_learned: "short takeaway",
  visual_scene_description:
    "a short description of what the scam setup would look like in the real world",
  visual_cues: ["visual clue 1", "visual clue 2"],
};

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY. Add it to your local env or Vercel project settings.");
  }

  return new GoogleGenAI({ apiKey });
}

function parseJson<T>(text: string): T {
  const cleaned = text.replace(/```json|```/g, "").trim();
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  const jsonText =
    firstBrace >= 0 && lastBrace > firstBrace
      ? cleaned.slice(firstBrace, lastBrace + 1)
      : cleaned;

  return JSON.parse(jsonText) as T;
}

async function generateJson<T>(contents: GeminiContents): Promise<T> {
  const client = getClient();
  const response = await client.models.generateContent({
    model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
    contents,
    config: {
      temperature: 0.25,
      responseMimeType: "application/json",
    },
  });

  if (!response.text) {
    throw new Error("Gemini returned an empty response.");
  }

  return parseJson<T>(response.text);
}

function analysisPrompt(content: string) {
  return `You are RedFlag AI, a safety-focused scam detection assistant.

Analyze suspicious user-provided digital content and detect likely scam, phishing, impersonation, fake-profile, suspicious-domain, urgency, manipulation, or AI voice-cloning indicators.

Return ONLY valid JSON in this exact shape:
${JSON.stringify(ANALYSIS_SCHEMA, null, 2)}

Rules:
- risk_level must be exactly one of: Low, Medium, High
- Keep the summary plain-language and concise
- Guidance must be practical and safety-focused
- Do not provide legal, medical, or mental health advice
- No markdown, no extra commentary

User content:
${content}`;
}

function storyPrompt(summary: string, riskLevel: string, signals: string[]) {
  return `You are RedFlag AI's creative educator.

Generate a short educational story about how the scam could unfold. Also include a vivid but concise visual description so a demo audience can imagine what the scam setup would look like, especially for QR-code scams, fake messages, and impersonation attempts.

Return ONLY valid JSON in this exact shape:
${JSON.stringify(STORY_SCHEMA, null, 2)}

Rules:
- Keep the story concise and easy to present in a demo
- The visual scene should describe what the user would physically or digitally see
- The lesson should be practical and memorable
- No markdown, no extra commentary

Risk level: ${riskLevel}
Summary: ${summary}
Signals: ${signals.join(", ")}`;
}

export async function analyzeText(text: string): Promise<AnalysisResult> {
  return generateJson<AnalysisResult>(analysisPrompt(text));
}

export async function analyzeLink(url: string): Promise<AnalysisResult> {
  return generateJson<AnalysisResult>(analysisPrompt(`Analyze this suspicious URL: ${url}`));
}

export async function analyzeImage(base64Data: string, mimeType: string): Promise<AnalysisResult> {
  return generateJson<AnalysisResult>([
    {
      text: analysisPrompt(
        "Analyze the attached screenshot or image for suspicious phishing cues, QR traps, fake profile indicators, urgency language, or manipulation tactics.",
      ),
    },
    {
      inlineData: {
        data: base64Data,
        mimeType,
      },
    },
  ]);
}

export async function generateStory(summary: string, riskLevel: string, signals: string[]): Promise<StoryResult> {
  return generateJson<StoryResult>(storyPrompt(summary, riskLevel, signals));
}
