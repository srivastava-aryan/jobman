import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateMasterResume, toResumeContent } from "@/lib/resume";
import { generateTailoredResume } from "@/lib/analysis/tailor";
import { SuggestionListSchema } from "@/lib/schemas";

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

  const latestAnalysis = job.analyses[0];
  if (!latestAnalysis) {
    return NextResponse.json(
      { error: "Run an analysis first." },
      { status: 400 }
    );
  }

  const suggestionsResult = SuggestionListSchema.safeParse(
    latestAnalysis.suggestions
  );
  if (!suggestionsResult.success) {
    return NextResponse.json(
      { error: "Stored suggestions are malformed — re-run analysis." },
      { status: 500 }
    );
  }

  const applied = suggestionsResult.data.filter((s) => s.applied);
  if (applied.length === 0) {
    return NextResponse.json(
      { error: "Mark at least one suggestion as applied first." },
      { status: 400 }
    );
  }

  const masterRecord = await getOrCreateMasterResume();
  const masterContent = toResumeContent(masterRecord);

  let tailored;
  try {
    tailored = await generateTailoredResume(masterContent, applied, job.jdRaw);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Tailoring failed" },
      { status: 500 }
    );
  }

  // Create the tailored resume and link it to the job atomically — if the
  // link update fails, the resume creation rolls back too, so we never end
  // up with an orphaned tailored resume nothing points to.
  const resumeRecord = await prisma.$transaction(async (tx) => {
    const created = await tx.resume.create({
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

    await tx.jobApplication.update({
      where: { id: job.id },
      data: { tailoredResumeId: created.id },
    });

    return created;
  });

  return NextResponse.json(resumeRecord, { status: 201 });
}
