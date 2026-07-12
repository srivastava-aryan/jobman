export interface Suggestion {
  id: string;
  type: "add_keyword" | "reframe_bullet" | "add_project_detail" | "general";
  targetSection?: string; // e.g. "projects.dsa-tracker" — which resume entry this applies to
  title: string; // short label, e.g. "Add 'Redis' to DSA Tracker"
  detail: string; // the actual suggested change, in plain language
  applied: boolean;
}

export interface JDExtraction {
  requiredSkills: string[];
  niceToHaveSkills: string[];
  yearsExperience: string | null;
  roleLevel: string | null;
  keyResponsibilities: string[];
}

export interface AnalysisResult extends JDExtraction {
  matchedSkills: string[];
  missingSkills: string[];
  hardMatchScore: number;
  semanticScore: number;
  overallScore: number;
  suggestions: Suggestion[];
}
