import { NextRequest, NextResponse } from "next/server";

import { analyzeLink } from "@/lib/gemini";
import { jsonError } from "@/lib/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const url = typeof body?.url === "string" ? body.url.trim() : "";

    if (!url) {
      return jsonError("Missing URL to analyze.", 400);
    }

    const result = await analyzeLink(url);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Link analysis failed.";
    return jsonError(message, 500);
  }
}
