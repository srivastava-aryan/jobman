function scoreColor(score: number) {
  if (score >= 75) return { text: "text-accent-strong", ring: "#2F6F4F" };
  if (score >= 50) return { text: "text-warn", ring: "#B45309" };
  return { text: "text-danger", ring: "#B42318" };
}

export function ScoreBadge({ score }: { score: number }) {
  const { text, ring } = scoreColor(score);
  const circumference = 2 * Math.PI * 16;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-11 h-11 shrink-0">
      <svg viewBox="0 0 40 40" className="w-11 h-11 -rotate-90">
        <circle
          cx="20"
          cy="20"
          r="16"
          fill="none"
          stroke="#E2E4DF"
          strokeWidth="3"
        />
        <circle
          cx="20"
          cy="20"
          r="16"
          fill="none"
          stroke={ring}
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span
        className={`absolute inset-0 flex items-center justify-center text-[11px] font-medium data-num ${text}`}
      >
        {Math.round(score)}
      </span>
    </div>
  );
}
