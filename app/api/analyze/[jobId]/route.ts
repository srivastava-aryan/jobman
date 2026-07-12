import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateMasterResume, toResumeContent } from "@/lib/resume";
import { runAnalysis, READY_THRESHOLD } from "@/lib/analysis/run";

export async function POST(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  const job = await prisma.jobApplication.findUnique({
    where: { id: params.jobId },
  });

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const resumeRecord = await getOrCreateMasterResume();
  const resume = toResumeContent(resumeRecord);

  await prisma.jobApplication.update({
    where: { id: job.id },
    data: { status: "ANALYZING", resumeId: resumeRecord.id },
  });

  let result;
  try {
    result = await runAnalysis(job.jdRaw, resume);
  } catch (err) {
    // Revert status so a failed analysis doesn't strand the job as "Analyzing" forever
    await prisma.jobApplication.update({
      where: { id: job.id },
      data: { status: "DRAFT" },
    });
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Analysis failed" },
      { status: 500 }
    );
  }

  const analysis = await prisma.matchAnalysis.create({
    data: {
      jobApplicationId: job.id,
      requiredSkills: result.requiredSkills,
      niceToHaveSkills: result.niceToHaveSkills,
      matchedSkills: result.matchedSkills,
      missingSkills: result.missingSkills,
      hardMatchScore: result.hardMatchScore,
      semanticScore: result.semanticScore,
      overallScore: result.overallScore,
      suggestions: result.suggestions,
    },
  });

  await prisma.jobApplication.update({
    where: { id: job.id },
    data: {
      status: result.overallScore >= READY_THRESHOLD ? "READY" : "DRAFT",
    },
  });

  return NextResponse.json(analysis, { status: 201 });
}
