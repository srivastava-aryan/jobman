import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateMasterResume } from "@/lib/resume";
import { generateTailoredResume } from "@/lib/analysis/tailor";
import type {
  ResumeContent,
  ProjectEntry,
  ExperienceEntry,
  EducationEntry,
} from "@/types/resume";
import type { Suggestion } from "@/types/analysis";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const job = await prisma.jobApplication.findUnique({
    where: { id: params.id },
    include: { analyses: { orderBy: { createdAt: "desc" }, take: 1 } },
  });

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const latest = job.analyses[0];
  if (!latest) {
    return NextResponse.json(
      { error: "Run an analysis first." },
      { status: 400 }
    );
  }

  const suggestions = latest.suggestions as unknown as Suggestion[];
  const applied = suggestions.filter((s) => s.applied);

  if (applied.length === 0) {
    return NextResponse.json(
      { error: "Mark at least one suggestion as applied first." },
      { status: 400 }
    );
  }

  const masterRecord = await getOrCreateMasterResume();
  const masterContent: ResumeContent = {
    summary: masterRecord.summary ?? "",
    skills: (masterRecord.skills as string[]) ?? [],
    projects: (masterRecord.projects as unknown as ProjectEntry[]) ?? [],
    experience: (masterRecord.experience as unknown as ExperienceEntry[]) ?? [],
    education: (masterRecord.education as unknown as EducationEntry[]) ?? [],
  };

  let tailored: ResumeContent;
  try {
    tailored = await generateTailoredResume(masterContent, applied, job.jdRaw);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Tailoring failed" },
      { status: 500 }
    );
  }

  const resumeRecord = await prisma.resume.create({
    data: {
      label: `Tailored — ${job.company} ${job.role}`,
      isMaster: false,
      summary: tailored.summary,
      skills: tailored.skills,
      projects: tailored.projects,
      experience: tailored.experience,
      education: tailored.education,
    },
  });

  await prisma.jobApplication.update({
    where: { id: job.id },
    data: { tailoredResumeId: resumeRecord.id },
  });

  return NextResponse.json(resumeRecord, { status: 201 });
}
