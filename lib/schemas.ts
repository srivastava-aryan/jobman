import { z } from "zod";

export const ProjectEntrySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  bullets: z.array(z.string()),
  techStack: z.array(z.string()),
  link: z.string().optional(),
});

export const ExperienceEntrySchema = z.object({
  id: z.string(),
  company: z.string(),
  title: z.string(),
  startDate: z.string(),
  endDate: z.string().nullable(),
  bullets: z.array(z.string()),
  techStack: z.array(z.string()),
});

export const EducationEntrySchema = z.object({
  id: z.string(),
  institution: z.string(),
  degree: z.string(),
  field: z.string(),
  year: z.string(),
});

export const ResumeContentSchema = z.object({
  summary: z.string(),
  skills: z.array(z.string()),
  projects: z.array(ProjectEntrySchema),
  experience: z.array(ExperienceEntrySchema),
  education: z.array(EducationEntrySchema),
});

export const JDExtractionSchema = z.object({
  requiredSkills: z.array(z.string()),
  niceToHaveSkills: z.array(z.string()),
  yearsExperience: z.string().nullable(),
  roleLevel: z.string().nullable(),
  keyResponsibilities: z.array(z.string()),
});

export const SemanticScoreSchema = z.object({
  semanticScore: z.number(),
});

export const RawSuggestionSchema = z.object({
  type: z.enum(["add_keyword", "reframe_bullet"]),
  targetSection: z.string().nullable(),
  title: z.string(),
  detail: z.string(),
});

export const RawSuggestionListSchema = z.array(RawSuggestionSchema);

export const SuggestionSchema = z.object({
  id: z.string(),
  type: z.enum(["add_keyword", "reframe_bullet", "add_project_detail", "general"]),
  targetSection: z.string().optional(),
  title: z.string(),
  detail: z.string(),
  applied: z.boolean(),
});

export const SuggestionListSchema = z.array(SuggestionSchema);

// "Draft" variants omit `id` — used when the LLM is generating new resume
// content (e.g. from an uploaded PDF) where we assign ids ourselves after
// validation, rather than trusting the model to invent well-formed unique ids.
export const ProjectEntryDraftSchema = ProjectEntrySchema.omit({ id: true });
export const ExperienceEntryDraftSchema = ExperienceEntrySchema.omit({
  id: true,
});
export const EducationEntryDraftSchema = EducationEntrySchema.omit({
  id: true,
});

export const ResumeContentDraftSchema = z.object({
  summary: z.string(),
  skills: z.array(z.string()),
  projects: z.array(ProjectEntryDraftSchema),
  experience: z.array(ExperienceEntryDraftSchema),
  education: z.array(EducationEntryDraftSchema),
});
