import { getOrCreateMasterResume, toResumeContent } from "@/lib/resume";
import { ResumeEditor } from "@/components/ResumeEditor";

export default async function ResumePage() {
  const resume = await getOrCreateMasterResume();
  const initial = toResumeContent(resume);

  return <ResumeEditor resumeId={resume.id} initial={initial} />;
}
