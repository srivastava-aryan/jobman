import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StatusPill } from "@/components/StatusPill";

export default async function JobDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const job = await prisma.jobApplication.findUnique({
    where: { id: params.id },
  });

  if (!job) notFound();

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

      <div className="bg-surface border border-border rounded-card p-5 mb-6">
        <h2 className="text-xs font-medium text-ink-600 mb-2">
          Job description
        </h2>
        <p className="text-sm text-ink-600 whitespace-pre-wrap leading-relaxed">
          {job.jdRaw}
        </p>
      </div>

      <div className="border border-dashed border-border rounded-card p-6 text-center text-sm text-ink-400">
        Match analysis and resume suggestions render here — next up.
      </div>
    </div>
  );
}
