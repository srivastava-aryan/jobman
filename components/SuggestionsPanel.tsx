"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Suggestion } from "@/types/analysis";

const TYPE_LABELS: Record<string, string> = {
  add_keyword: "Confirm & add",
  reframe_bullet: "Reword bullet",
  add_project_detail: "Add detail",
  general: "Suggestion",
};

export function SuggestionsPanel({
  analysisId,
  suggestions,
}: {
  analysisId: string;
  suggestions: Suggestion[];
}) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function toggle(suggestion: Suggestion) {
    setPendingId(suggestion.id);
    try {
      const res = await fetch(`/api/analysis/${analysisId}/suggestions`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          suggestionId: suggestion.id,
          applied: !suggestion.applied,
        }),
      });
      if (res.ok) router.refresh();
    } finally {
      setPendingId(null);
    }
  }

  if (suggestions.length === 0) {
    return (
      <div className="border border-dashed border-border rounded-card p-6 text-center text-sm text-ink-400">
        No suggestions — either your resume already covers this JD well, or
        there wasn't enough to ground a suggestion in honestly.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {suggestions.map((s) => (
        <div
          key={s.id}
          className={`border rounded-card p-4 bg-surface transition-colors ${
            s.applied ? "border-accent/40 bg-accent-soft/40" : "border-border"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-medium uppercase tracking-wide text-ink-400">
                  {TYPE_LABELS[s.type] ?? s.type}
                </span>
                {s.targetSection && (
                  <span className="text-[10px] font-mono text-ink-300">
                    {s.targetSection}
                  </span>
                )}
              </div>
              <div className="text-sm font-medium mb-1">{s.title}</div>
              <p className="text-sm text-ink-600 leading-relaxed">
                {s.detail}
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggle(s)}
              disabled={pendingId === s.id}
              className={`shrink-0 text-xs font-medium rounded-md px-3 py-1.5 transition-colors disabled:opacity-50 ${
                s.applied
                  ? "bg-accent text-white hover:bg-accent-strong"
                  : "border border-border text-ink-600 hover:border-accent hover:text-accent-strong"
              }`}
            >
              {s.applied ? "Applied" : "Mark applied"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
