import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { SuggestionListSchema } from "@/lib/schemas";

const ToggleSchema = z.object({
  suggestionId: z.string(),
  applied: z.boolean(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { analysisId: string } }
) {
  const body = await req.json();
  const parsed = ToggleSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const analysis = await prisma.matchAnalysis.findUnique({
    where: { id: params.analysisId },
  });

  if (!analysis) {
    return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
  }

  const suggestionsResult = SuggestionListSchema.safeParse(
    analysis.suggestions
  );
  if (!suggestionsResult.success) {
    return NextResponse.json(
      { error: "Stored suggestions are malformed — re-run analysis." },
      { status: 500 }
    );
  }

  const updated = suggestionsResult.data.map((s) =>
    s.id === parsed.data.suggestionId
      ? { ...s, applied: parsed.data.applied }
      : s
  );

  const saved = await prisma.matchAnalysis.update({
    where: { id: params.analysisId },
    data: { suggestions: updated },
  });

  return NextResponse.json(saved);
}
