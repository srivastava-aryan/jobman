import { extractJD } from "@/lib/analysis/extract";
import { computeHardMatch, collectResumeSkills } from "@/lib/analysis/score";
import { computeSemanticScore } from "@/lib/analysis/semantic";
import { generateSuggestions } from "@/lib/analysis/suggestions";
import type { ResumeContent } from "@/types/resume";
import type { AnalysisResult } from "@/types/analysis";

// Hard skill overlap is objective and fast to trust; semantic fit catches
// what keyword matching misses but is a fuzzier signal — weighted lower.
const HARD_WEIGHT = 0.6;
const SEMANTIC_WEIGHT = 0.4;

// Score at/above this is considered "ready to apply" on the tracker.
export const READY_THRESHOLD = 70;

export async function runAnalysis(
  jdRaw: string,
  resume: ResumeContent
): Promise<AnalysisResult> {
  const extraction = await extractJD(jdRaw);

  const resumeSkills = collectResumeSkills(resume);
  const { matched, missing, hardMatchScore } = computeHardMatch(
    resumeSkills,
    extraction.requiredSkills,
    extraction.niceToHaveSkills
  );

  const semanticScore = await computeSemanticScore(resume, extraction);
  const suggestions = await generateSuggestions(
    resume,
    missing,
    extraction.requiredSkills
  );

  const overallScore = Math.round(
    hardMatchScore * HARD_WEIGHT + semanticScore * SEMANTIC_WEIGHT
  );

  return {
    ...extraction,
    matchedSkills: matched,
    missingSkills: missing,
    hardMatchScore,
    semanticScore,
    overallScore,
    suggestions,
  };
}
