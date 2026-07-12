import { z } from "zod";
import { prisma } from "@/lib/prisma";
import type { Resume as ResumeRecord } from "@prisma/client";
import type { ResumeContent } from "@/types/resume";
import {
  ResumeContentSchema,
  ProjectEntrySchema,
  ExperienceEntrySchema,
  EducationEntrySchema,
} from "@/lib/schemas";

export async function getOrCreateMasterResume() {
  const existing = await prisma.resume.findFirst({
    where: { isMaster: true },
  });

  if (existing) return existing;

  return prisma.resume.create({
    data: {
      label: "Master Resume",
      isMaster: true,
      summary: "",
      skills: [],
      projects: [],
      experience: [],
      education: [],
    },
  });
}

/**
 * Converts a raw Prisma Resume record into typed ResumeContent, validating
 * each JSON field with Zod instead of blindly casting. If a field is
 * malformed (e.g. hand-edited in the DB, or from a future schema change),
 * it degrades to an empty array/string for that field and logs a warning,
 * rather than crashing the page or silently trusting bad shape.
 */
export function toResumeContent(record: ResumeRecord): ResumeContent {
  const parsed = ResumeContentSchema.safeParse({
    summary: record.summary ?? "",
    skills: record.skills,
    projects: record.projects,
    experience: record.experience,
    education: record.education ?? [],
  });

  if (parsed.success) return parsed.data;

  console.warn(
    `Resume ${record.id} has malformed content, falling back field-by-field:`,
    parsed.error.flatten()
  );

  const skillsResult = z.array(z.string()).safeParse(record.skills);
  const projectsResult = z.array(ProjectEntrySchema).safeParse(record.projects);
  const experienceResult = z
    .array(ExperienceEntrySchema)
    .safeParse(record.experience);
  const educationResult = z
    .array(EducationEntrySchema)
    .safeParse(record.education ?? []);

  return {
    summary: record.summary ?? "",
    skills: skillsResult.success ? skillsResult.data : [],
    projects: projectsResult.success ? projectsResult.data : [],
    experience: experienceResult.success ? experienceResult.data : [],
    education: educationResult.success ? educationResult.data : [],
  };
}
