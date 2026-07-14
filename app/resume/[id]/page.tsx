import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { toResumeContent } from "@/lib/resume";
import { ResumeEditor } from "@/components/ResumeEditor";

export default async function ResumeByIdPage({
  params,
}: {
  params: { id: string };
}) {
  const resume = await prisma.resume.findUnique({ where: { id: params.id } });
  if (!resume) notFound();

  const initial = toResumeContent(resume);

  return (
    <ResumeEditor
      resumeId={resume.id}
      initial={initial}
      title={resume.label}
      showUpload={resume.isMaster}
      subtitle={
        resume.isMaster
          ? "Kept as structured data so match scoring and suggestions can target specific projects and bullets, not just a text blob."
          : "A tailored copy for one job application. Edits here don't affect your master resume."
      }
    />
  );
}
