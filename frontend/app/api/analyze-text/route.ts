import { NextRequest, NextResponse } from "next/server";

import { analyzeText } from "@/lib/gemini";
import { jsonError } from "@/lib/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const text = typeof body?.text === "string" ? body.text.trim() : "";

    if (!text) {
      return jsonError("Missing text to analyze.", 400);
    }

    const result = await analyzeText(text);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Text analysis failed.";
    return jsonError(message, 500);
  }
}
