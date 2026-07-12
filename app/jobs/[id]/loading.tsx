export default function JobDetailLoading() {
  return (
    <div className="max-w-3xl animate-pulse">
      <div className="h-5 w-48 bg-border rounded mb-2" />
      <div className="h-4 w-32 bg-border rounded mb-6" />
      <div className="h-24 bg-border rounded-card mb-6" />
      <div className="h-32 bg-border rounded-card mb-6" />
      <div className="h-40 bg-border rounded-card" />
    </div>
  );
}
