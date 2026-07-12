"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CreateTailoredResumeButton({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/jobs/${jobId}/tailor`, {
        method: "POST",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Could not create tailored resume.");
      }
      const resume = await res.json();
      router.push(`/resume/${resume.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={run}
        disabled={loading}
        className="text-sm font-medium border border-accent text-accent-strong rounded-md px-4 py-2 hover:bg-accent-soft transition-colors disabled:opacity-50"
      >
        {loading ? "Generating..." : "Create tailored resume"}
      </button>
      {error && (
        <p className="text-sm text-danger mt-2" role="alert" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
}
