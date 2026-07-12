import Link from "next/link";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/jobs/new", label: "Add Job" },
  { href: "/resume", label: "Resume" },
];

export function Sidebar() {
  return (
    <aside className="w-56 shrink-0 border-r border-border bg-surface px-5 py-8 flex flex-col">
      <div className="mb-10">
        <span className="text-sm font-semibold tracking-tight">
          Job Match
        </span>
        <span className="block text-xs text-ink-300 data-num mt-0.5">
          v0.1
        </span>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-sm text-ink-600 hover:text-ink-900 hover:bg-accent-soft rounded-md px-3 py-2 transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto text-xs text-ink-300">
        Resume-first job tracking
      </div>
    </aside>
  );
}
