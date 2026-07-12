const STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-ink-300/10 text-ink-400",
  ANALYZING: "bg-warn-soft text-warn",
  READY: "bg-accent-soft text-accent-strong",
  APPLIED: "bg-ink-900/5 text-ink-600",
  INTERVIEWING: "bg-accent-soft text-accent-strong",
  REJECTED: "bg-danger-soft text-danger",
  OFFER: "bg-accent text-white",
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  ANALYZING: "Analyzing",
  READY: "Ready to apply",
  APPLIED: "Applied",
  INTERVIEWING: "Interviewing",
  REJECTED: "Rejected",
  OFFER: "Offer",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
        STATUS_STYLES[status] ?? STATUS_STYLES.DRAFT
      }`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
