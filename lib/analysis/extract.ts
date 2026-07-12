import { getStructuredResponse } from "@/lib/gemini";
import type { JDExtraction } from "@/types/analysis";

export async function extractJD(jdRaw: string): Promise<JDExtraction> {
  const prompt = `You are analyzing a job description to extract structured requirements.

Return ONLY a JSON object (no markdown, no preamble, no explanation) matching exactly this shape:
{
  "requiredSkills": string[],
  "niceToHaveSkills": string[],
  "yearsExperience": string | null,
  "roleLevel": string | null,
  "keyResponsibilities": string[]
}

Rules:
- requiredSkills: specific technologies, languages, frameworks, or tools explicitly required or clearly essential to the role.
- niceToHaveSkills: skills described as "preferred", "bonus", "nice to have", or clearly secondary.
- yearsExperience: e.g. "2-4 years", or null if not mentioned.
- roleLevel: e.g. "Entry-level", "Mid-level", "Senior", or null if it can't be inferred.
- keyResponsibilities: 3-6 short phrases capturing the core day-to-day work, not full sentences copied from the posting.
- Use common short forms for skill names (e.g. "TypeScript" not "TypeScript programming language", "Postgres" not "PostgreSQL database").
- Do not invent skills that aren't actually implied by the text.

Job description:
"""
${jdRaw}
"""`;

  return getStructuredResponse<JDExtraction>(prompt);
}
