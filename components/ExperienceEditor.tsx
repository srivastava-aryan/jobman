"use client";

import type { ExperienceEntry } from "@/types/resume";
import { BulletListEditor } from "@/components/BulletListEditor";
import { TagInput } from "@/components/TagInput";

function newExperience(): ExperienceEntry {
  return {
    id: crypto.randomUUID(),
    company: "",
    title: "",
    startDate: "",
    endDate: null,
    bullets: [],
    techStack: [],
  };
}

export function ExperienceEditor({
  experience,
  onChange,
}: {
  experience: ExperienceEntry[];
  onChange: (next: ExperienceEntry[]) => void;
}) {
  function update(id: string, patch: Partial<ExperienceEntry>) {
    onChange(experience.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  function remove(id: string) {
    onChange(experience.filter((e) => e.id !== id));
  }

  return (
    <div className="flex flex-col gap-4">
      {experience.map((exp) => (
        <div
          key={exp.id}
          className="border border-border rounded-card p-4 bg-white"
        >
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              value={exp.company}
              onChange={(e) => update(exp.id, { company: e.target.value })}
              placeholder="Company"
              className="input text-sm font-medium"
            />
            <input
              value={exp.title}
              onChange={(e) => update(exp.id, { title: e.target.value })}
              placeholder="Title"
              className="input text-sm"
            />
          </div>

          <div className="grid grid-cols-[1fr_1fr_auto] gap-3 mb-3 items-center">
            <input
              type="month"
              value={exp.startDate}
              onChange={(e) => update(exp.id, { startDate: e.target.value })}
              className="input text-sm"
            />
            <input
              type="month"
              value={exp.endDate ?? ""}
              onChange={(e) =>
                update(exp.id, { endDate: e.target.value || null })
              }
              disabled={exp.endDate === null && exp.startDate === ""}
              className="input text-sm"
            />
            <label className="flex items-center gap-1.5 text-xs text-ink-600 whitespace-nowrap">
              <input
                type="checkbox"
                checked={exp.endDate === null}
                onChange={(e) =>
                  update(exp.id, { endDate: e.target.checked ? null : "" })
                }
              />
              Present
            </label>
          </div>

          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <span className="text-xs font-medium text-ink-600 block mb-1.5">
                Bullets
              </span>
              <BulletListEditor
                bullets={exp.bullets}
                onChange={(bullets) => update(exp.id, { bullets })}
              />
            </div>
            <button
              type="button"
              onClick={() => remove(exp.id)}
              className="text-ink-300 hover:text-danger text-sm px-1"
              aria-label="Remove experience"
            >
              ×
            </button>
          </div>

          <div className="mt-3">
            <span className="text-xs font-medium text-ink-600 block mb-1.5">
              Tech stack
            </span>
            <TagInput
              value={exp.techStack}
              onChange={(techStack) => update(exp.id, { techStack })}
              placeholder="Add a technology and press Enter"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...experience, newExperience()])}
        className="self-start text-sm font-medium text-accent hover:text-accent-strong"
      >
        + Add experience
      </button>
    </div>
  );
}
