export default function ResumeLoading() {
  return (
    <div className="max-w-3xl animate-pulse">
      <div className="h-5 w-40 bg-border rounded mb-2" />
      <div className="h-4 w-64 bg-border rounded mb-8" />
      <div className="h-16 bg-border rounded-card mb-8" />
      <div className="h-10 bg-border rounded-card mb-8" />
      <div className="h-48 bg-border rounded-card" />
    </div>
  );
}
