import { dedupeTags } from "@/lib/normalize";
import type { ResumeContent } from "@/types/resume";

/** Pulls every skill tag out of a resume — top-level skills plus every project's and job's tech stack. */
export function collectResumeSkills(resume: ResumeContent): string[] {
  const fromProjects = resume.projects.flatMap((p) => p.techStack);
  const fromExperience = resume.experience.flatMap((e) => e.techStack);
  return dedupeTags([...resume.skills, ...fromProjects, ...fromExperience]);
}

function key(tag: string): string {
  return tag.toLowerCase().trim();
}

export interface HardMatchResult {
  matched: string[];
  missing: string[];
  hardMatchScore: number;
}

/**
 * Required skills count for 2x weight, nice-to-have for 1x, so missing a
 * required skill hurts the score more than missing an optional one.
 * This is a pure string-overlap check — "Node" vs "Node.js" won't match.
 * The semantic pass covers the judgment call this misses.
 */
export function computeHardMatch(
  resumeSkills: string[],
  requiredSkills: string[],
  niceToHaveSkills: string[]
): HardMatchResult {
  const resumeSet = new Set(resumeSkills.map(key));

  const allJdSkills = dedupeTags([...requiredSkills, ...niceToHaveSkills]);
  const matched: string[] = [];
  const missing: string[] = [];

  for (const skill of allJdSkills) {
    if (resumeSet.has(key(skill))) {
      matched.push(skill);
    } else {
      missing.push(skill);
    }
  }

  let earned = 0;
  let possible = 0;

  for (const skill of requiredSkills) {
    possible += 2;
    if (resumeSet.has(key(skill))) earned += 2;
  }
  for (const skill of niceToHaveSkills) {
    possible += 1;
    if (resumeSet.has(key(skill))) earned += 1;
  }

  // If a JD lists no extractable skills at all, don't penalize — treat as neutral.
  const hardMatchScore = possible === 0 ? 100 : Math.round((earned / possible) * 100);

  return { matched, missing, hardMatchScore };
}
