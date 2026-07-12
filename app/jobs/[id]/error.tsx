"use client";

export default function JobDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-3xl" role="alert" aria-live="assertive">
      <h1 className="text-lg font-semibold mb-2">Couldn't load this job</h1>
      <p className="text-sm text-ink-400 mb-4">
        {error.message || "Something went wrong loading this page."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="text-sm font-medium bg-accent text-white rounded-md px-4 py-2 hover:bg-accent-strong transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
