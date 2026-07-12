"use client";

import type { ProjectEntry } from "@/types/resume";
import { BulletListEditor } from "@/components/BulletListEditor";
import { TagInput } from "@/components/TagInput";

function newProject(): ProjectEntry {
  return {
    id: crypto.randomUUID(),
    name: "",
    description: "",
    bullets: [],
    techStack: [],
    link: "",
  };
}

export function ProjectsEditor({
  projects,
  onChange,
}: {
  projects: ProjectEntry[];
  onChange: (next: ProjectEntry[]) => void;
}) {
  function update(id: string, patch: Partial<ProjectEntry>) {
    onChange(projects.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  function remove(id: string) {
    onChange(projects.filter((p) => p.id !== id));
  }

  return (
    <div className="flex flex-col gap-4">
      {projects.map((project) => (
        <div
          key={project.id}
          className="border border-border rounded-card p-4 bg-white"
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <input
              value={project.name}
              onChange={(e) => update(project.id, { name: e.target.value })}
              placeholder="Project name"
              className="input text-sm font-medium flex-1"
            />
            <button
              type="button"
              onClick={() => remove(project.id)}
              className="text-ink-300 hover:text-danger text-sm px-1"
              aria-label="Remove project"
            >
              ×
            </button>
          </div>

          <textarea
            value={project.description}
            onChange={(e) =>
              update(project.id, { description: e.target.value })
            }
            placeholder="One-line description"
            rows={2}
            className="input text-sm mb-3"
          />

          <div className="mb-3">
            <span className="text-xs font-medium text-ink-600 block mb-1.5">
              Bullets
            </span>
            <BulletListEditor
              bullets={project.bullets}
              onChange={(bullets) => update(project.id, { bullets })}
            />
          </div>

          <div className="mb-3">
            <span className="text-xs font-medium text-ink-600 block mb-1.5">
              Tech stack
            </span>
            <TagInput
              value={project.techStack}
              onChange={(techStack) => update(project.id, { techStack })}
              placeholder="Add a technology and press Enter"
            />
          </div>

          <input
            value={project.link ?? ""}
            onChange={(e) => update(project.id, { link: e.target.value })}
            placeholder="Link (optional)"
            className="input text-sm"
          />
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...projects, newProject()])}
        className="self-start text-sm font-medium text-accent hover:text-accent-strong"
      >
        + Add project
      </button>
    </div>
  );
}
