import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ResumeEditor } from "@/components/ResumeEditor";
import type {
  ProjectEntry,
  ExperienceEntry,
  EducationEntry,
  ResumeContent,
} from "@/types/resume";

export default async function ResumeByIdPage({
  params,
}: {
  params: { id: string };
}) {
  const resume = await prisma.resume.findUnique({ where: { id: params.id } });
  if (!resume) notFound();

  const initial: ResumeContent = {
    summary: resume.summary ?? "",
    skills: (resume.skills as string[]) ?? [],
    projects: (resume.projects as unknown as ProjectEntry[]) ?? [],
    experience: (resume.experience as unknown as ExperienceEntry[]) ?? [],
    education: (resume.education as unknown as EducationEntry[]) ?? [],
  };

  return (
    <ResumeEditor
      resumeId={resume.id}
      initial={initial}
      title={resume.label}
      subtitle={
        resume.isMaster
          ? "Kept as structured data so match scoring and suggestions can target specific projects and bullets, not just a text blob."
          : "A tailored copy for one job application. Edits here don't affect your master resume."
      }
    />
  );
}
