import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ScoreBadge } from "@/components/ScoreBadge";
import { StatusPill } from "@/components/StatusPill";

async function getApplications() {
  return prisma.jobApplication.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      analyses: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });
}

export default async function DashboardPage() {
  const applications = await getApplications();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <p className="text-sm text-ink-400 mt-1">
            {applications.length === 0
              ? "No jobs tracked yet."
              : `${applications.length} job${
                  applications.length === 1 ? "" : "s"
                } tracked.`}
          </p>
        </div>
        <Link
          href="/jobs/new"
          className="text-sm font-medium bg-accent text-white rounded-md px-4 py-2 hover:bg-accent-strong transition-colors"
        >
          + Add Job
        </Link>
      </div>

      {applications.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-2">
          {applications.map((app) => {
            const latest = app.analyses[0];
            return (
              <Link
                key={app.id}
                href={`/jobs/${app.id}`}
                className="flex items-center gap-4 bg-surface border border-border rounded-card px-4 py-3 hover:border-ink-300 transition-colors"
              >
                <ScoreBadge score={latest?.overallScore ?? 0} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {app.role}
                  </div>
                  <div className="text-xs text-ink-400 truncate">
                    {app.company}
                    {app.source ? ` · ${app.source}` : ""}
                  </div>
                </div>
                <StatusPill status={app.status} />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="border border-dashed border-border rounded-card px-6 py-14 text-center">
      <p className="text-sm text-ink-400 mb-4">
        Paste your first job description to see how it matches your resume.
      </p>
      <Link
        href="/jobs/new"
        className="text-sm font-medium bg-accent text-white rounded-md px-4 py-2 hover:bg-accent-strong transition-colors inline-block"
      >
        + Add Job
      </Link>
    </div>
  );
}
