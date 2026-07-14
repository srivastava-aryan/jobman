"use client";

import { useRef, useState } from "react";
import type { ResumeContent } from "@/types/resume";

export function ResumeUpload({
  hasExistingContent,
  onParsed,
}: {
  hasExistingContent: boolean;
  onParsed: (content: ResumeContent) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    if (
      hasExistingContent &&
      !window.confirm(
        "This will replace everything currently in the form below with what's extracted from the PDF. You can still review and edit before saving. Continue?"
      )
    ) {
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/resume/parse-pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Couldn't parse that PDF.");
      }

      const content: ResumeContent = await res.json();
      onParsed(content);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="border border-dashed border-border rounded-card p-4 mb-8 bg-accent-soft/30">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium">Import from a PDF resume</p>
          <p className="text-xs text-ink-400 mt-0.5">
            Extracts skills, projects, and experience into the form below —
            review before saving. Scanned/image-only PDFs won&apos;t work.
          </p>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="shrink-0 text-sm font-medium bg-white border border-border rounded-md px-4 py-2 hover:border-accent hover:text-accent-strong transition-colors disabled:opacity-50"
        >
          {loading ? "Parsing..." : "Choose PDF"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>
      {error && (
        <p
          className="text-sm text-danger mt-3"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  );
}
