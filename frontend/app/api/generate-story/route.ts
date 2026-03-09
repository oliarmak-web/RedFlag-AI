import { NextRequest, NextResponse } from "next/server";

import { generateStory } from "@/lib/gemini";
import { jsonError } from "@/lib/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const summary = typeof body?.summary === "string" ? body.summary.trim() : "";
    const riskLevel = typeof body?.risk_level === "string" ? body.risk_level.trim() : "";
    const signals = Array.isArray(body?.signals_detected)
      ? body.signals_detected.filter((value: unknown): value is string => typeof value === "string")
      : [];

    if (!summary || !riskLevel) {
      return jsonError("Story generation needs summary and risk level.", 400);
    }

    const result = await generateStory(summary, riskLevel, signals);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Story generation failed.";
    return jsonError(message, 500);
  }
}
