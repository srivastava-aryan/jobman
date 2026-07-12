import { prisma } from "@/lib/prisma";
import type { ProjectEntry, ExperienceEntry, EducationEntry } from "@/types/resume";

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
      skills: [] as string[],
      projects: [] as ProjectEntry[],
      experience: [] as ExperienceEntry[],
      education: [] as EducationEntry[],
    },
  });
}
