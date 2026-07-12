"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RunAnalysisButton({
  jobId,
  hasAnalysis,
}: {
  jobId: string;
  hasAnalysis: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/analyze/${jobId}`, { method: "POST" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Analysis failed");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={run}
        disabled={loading}
        className="text-sm font-medium bg-accent text-white rounded-md px-4 py-2 hover:bg-accent-strong transition-colors disabled:opacity-50"
      >
        {loading ? "Analyzing..." : hasAnalysis ? "Re-analyze" : "Run analysis"}
      </button>
      {error && (
        <p className="text-sm text-danger mt-2" role="alert" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
}
