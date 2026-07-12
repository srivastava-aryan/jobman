"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewJobPage() {
  const router = useRouter();
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [source, setSource] = useState("");
  const [jdRaw, setJdRaw] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, role, source, jdRaw }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Could not save this job.");
      }

      const job = await res.json();
      router.push(`/jobs/${job.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-lg font-semibold mb-1">Add a job</h1>
      <p className="text-sm text-ink-400 mb-6">
        Paste the job description text. Matching and suggestions come next.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Company">
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              className="input"
              placeholder="e.g. Pantheon"
            />
          </Field>
          <Field label="Role">
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="input"
              placeholder="e.g. AI Engineer"
            />
          </Field>
        </div>

        <Field label="Source (optional)">
          <input
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="input"
            placeholder="e.g. LinkedIn, Naukri, Wellfound"
          />
        </Field>

        <Field label="Job description">
          <textarea
            value={jdRaw}
            onChange={(e) => setJdRaw(e.target.value)}
            required
            rows={12}
            className="input font-mono text-xs leading-relaxed"
            placeholder="Paste the full job description here..."
          />
        </Field>

        {error && <p className="text-sm text-danger">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="self-start text-sm font-medium bg-accent text-white rounded-md px-4 py-2 hover:bg-accent-strong transition-colors disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save job"}
        </button>
      </form>

      <style jsx global>{`
        .input {
          width: 100%;
          border: 1px solid #e2e4df;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 14px;
          background: #ffffff;
        }
        .input:focus {
          outline: none;
          border-color: #2f6f4f;
          box-shadow: 0 0 0 3px #e7f0ea;
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-ink-600">{label}</span>
      {children}
    </label>
  );
}
