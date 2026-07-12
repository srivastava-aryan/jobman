import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatusPill } from "@/components/StatusPill";
import { RunAnalysisButton } from "@/components/RunAnalysisButton";
import { AnalysisPanel } from "@/components/AnalysisPanel";
import { SuggestionsPanel } from "@/components/SuggestionsPanel";
import { CreateTailoredResumeButton } from "@/components/CreateTailoredResumeButton";
import type { Suggestion } from "@/types/analysis";

export default async function JobDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const job = await prisma.jobApplication.findUnique({
    where: { id: params.id },
    include: {
      analyses: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!job) notFound();

  const latest = job.analyses[0];

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold">{job.role}</h1>
          <p className="text-sm text-ink-400">
            {job.company}
            {job.source ? ` · ${job.source}` : ""}
          </p>
        </div>
        <StatusPill status={job.status} />
      </div>

      <div className="mb-6">
        {latest ? (
          <AnalysisPanel
            overallScore={latest.overallScore}
            hardMatchScore={latest.hardMatchScore}
            semanticScore={latest.semanticScore}
            matchedSkills={latest.matchedSkills as string[]}
            missingSkills={latest.missingSkills as string[]}
          />
        ) : (
          <div className="border border-dashed border-border rounded-card p-6 text-center text-sm text-ink-400 mb-4">
            No analysis yet — run one to see your match score.
          </div>
        )}
        <div className="mt-4">
          <RunAnalysisButton jobId={job.id} hasAnalysis={!!latest} />
        </div>
      </div>

      <div className="bg-surface border border-border rounded-card p-5 mb-6">
        <h2 className="text-xs font-medium text-ink-600 mb-2">
          Job description
        </h2>
        <p className="text-sm text-ink-600 whitespace-pre-wrap leading-relaxed">
          {job.jdRaw}
        </p>
      </div>

      <div>
        <h2 className="text-sm font-medium mb-3">Suggestions</h2>
        {latest ? (
          <SuggestionsPanel
            analysisId={latest.id}
            suggestions={latest.suggestions as unknown as Suggestion[]}
          />
        ) : (
          <div className="border border-dashed border-border rounded-card p-6 text-center text-sm text-ink-400">
            Run an analysis to get suggestions.
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-medium mb-3">Tailored resume</h2>
        {job.tailoredResumeId ? (
          <div className="flex items-center justify-between border border-border rounded-card p-4 bg-surface">
            <p className="text-sm text-ink-600">
              A tailored copy exists for this job.
            </p>
            <Link
              href={`/resume/${job.tailoredResumeId}`}
              className="text-sm font-medium text-accent-strong hover:underline"
            >
              View tailored resume →
            </Link>
          </div>
        ) : (
          <div className="border border-dashed border-border rounded-card p-4">
            <p className="text-sm text-ink-400 mb-3">
              Once you've marked suggestions applied above, generate a
              tailored copy of your resume for this job.
            </p>
            <CreateTailoredResumeButton jobId={job.id} />
          </div>
        )}
      </div>
    </div>
  );
}
