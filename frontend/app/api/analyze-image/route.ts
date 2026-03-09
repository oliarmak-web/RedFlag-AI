import { NextResponse } from "next/server";

import { analyzeImage } from "@/lib/gemini";
import { jsonError } from "@/lib/api";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return jsonError("Missing image file.", 400);
    }

    if (!file.type.startsWith("image/")) {
      return jsonError("Please upload an image file.", 400);
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");
    const result = await analyzeImage(base64Data, file.type);

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Image analysis failed.";
    return jsonError(message, 500);
  }
}
