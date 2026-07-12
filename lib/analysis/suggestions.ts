import { randomUUID } from "crypto";
import { getStructuredResponse } from "@/lib/gemini";
import type { ResumeContent } from "@/types/resume";
import type { Suggestion } from "@/types/analysis";

interface RawSuggestion {
  type: "add_keyword" | "reframe_bullet";
  targetSection: string | null;
  title: string;
  detail: string;
}

export async function generateSuggestions(
  resume: ResumeContent,
  missingSkills: string[],
  requiredSkills: string[]
): Promise<Suggestion[]> {
  if (missingSkills.length === 0 && resume.projects.length === 0 && resume.experience.length === 0) {
    return [];
  }

  const resumeSummary = summarizeResumeForPrompt(resume);

  const prompt = `You are helping a candidate improve how their resume reads for a specific job — through honest reframing and emphasis only. You must NEVER suggest claiming a skill or experience the candidate hasn't actually demonstrated. Fabricated resume content is harmful to the candidate and dishonest to employers.

Missing skills (appear in the job posting, not found in the resume):
${missingSkills.join(", ") || "(none)"}

Required skills for this role:
${requiredSkills.join(", ") || "(none)"}

Candidate's actual projects and experience:
${resumeSummary}

Generate up to 6 suggestions using ONLY these two types:

1. "reframe_bullet" — point to a specific existing bullet that could be reworded to surface relevant skills/keywords the candidate already demonstrably has, in language closer to the job posting. The suggested rewrite must stay strictly true to what the bullet already describes — sharpen the phrasing, don't add new claims.

2. "add_keyword" — for a missing skill that plausibly overlaps with a project's actual described work, phrase this as a question for the candidate to confirm, not an instruction to add it. Example: "If you used Docker to containerize the DSA Tracker deployment, consider listing it — it's not currently in that project's tech stack." Never assert they used something you can't see evidence of in their bullets.

If you cannot ground a suggestion in something already present in the resume, do not invent one — return fewer suggestions instead.

Return ONLY a JSON array (no markdown, no preamble), each item matching:
{
  "type": "add_keyword" | "reframe_bullet",
  "targetSection": string | null,
  "title": string,
  "detail": string
}`;

  const raw = await getStructuredResponse<RawSuggestion[]>(prompt);

  return raw.map((s) => ({
    id: randomUUID(),
    type: s.type,
    targetSection: s.targetSection ?? undefined,
    title: s.title,
    detail: s.detail,
    applied: false,
  }));
}

function summarizeResumeForPrompt(resume: ResumeContent): string {
  const expLines = resume.experience.map((e) => {
    const bullets = e.bullets
      .map((b, i) => `  [${e.title}-bullet-${i}] ${b}`)
      .join("\n");
    return `Experience: ${e.title} at ${e.company} (tech stack: ${e.techStack.join(", ") || "none listed"})\n${bullets}`;
  });

  const projectLines = resume.projects.map((p) => {
    const bullets = p.bullets
      .map((b, i) => `  [${p.name}-bullet-${i}] ${b}`)
      .join("\n");
    return `Project: ${p.name} (tech stack: ${p.techStack.join(", ") || "none listed"})\n${p.description}\n${bullets}`;
  });

  const combined = [...expLines, ...projectLines].join("\n\n");
  return combined || "(no projects or experience entered in the resume yet)";
}
