import { NextRequest, NextResponse } from "next/server";
import { extractResumeFromText } from "@/lib/analysis/parseResumePdf";

// pdf-parse and Buffer handling need the Node runtime, not edge.
export const runtime = "nodejs";

const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8MB

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "No file uploaded." },
      { status: 400 }
    );
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json(
      { error: "Please upload a PDF file." },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json(
      { error: "That PDF is too large (max 8MB)." },
      { status: 400 }
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  let rawText: string;
  try {
    // Importing the internal module directly, not the package root —
    // pdf-parse's top-level index.js runs a debug file read at import time
    // that breaks in Next.js's serverless/bundled environment.
    const pdfParse = (await import("pdf-parse/lib/pdf-parse.js")).default;
    const parsed = await pdfParse(buffer);
    rawText = parsed.text.trim();
  } catch (err) {
    return NextResponse.json(
      {
        error:
          "Couldn't read that PDF. It may be corrupted — try re-exporting it.",
      },
      { status: 400 }
    );
  }

  if (!rawText) {
    return NextResponse.json(
      {
        error:
          "No selectable text found in that PDF — it might be a scanned image rather than text. Try pasting your resume content manually instead.",
      },
      { status: 400 }
    );
  }

  try {
    const resumeContent = await extractResumeFromText(rawText);
    return NextResponse.json(resumeContent);
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Couldn't structure that resume — try again.",
      },
      { status: 500 }
    );
  }
}
