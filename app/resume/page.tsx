import { getOrCreateMasterResume } from "@/lib/resume";
import { ResumeEditor } from "@/components/ResumeEditor";
import type {
  ProjectEntry,
  ExperienceEntry,
  EducationEntry,
  ResumeContent,
} from "@/types/resume";

export default async function ResumePage() {
  const resume = await getOrCreateMasterResume();

  const initial: ResumeContent = {
    summary: resume.summary ?? "",
    skills: (resume.skills as string[]) ?? [],
    projects: (resume.projects as unknown as ProjectEntry[]) ?? [],
    experience: (resume.experience as unknown as ExperienceEntry[]) ?? [],
    education: (resume.education as unknown as EducationEntry[]) ?? [],
  };

  return <ResumeEditor resumeId={resume.id} initial={initial} />;
}
