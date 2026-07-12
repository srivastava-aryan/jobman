"use client";

import type { EducationEntry } from "@/types/resume";

function newEducation(): EducationEntry {
  return {
    id: crypto.randomUUID(),
    institution: "",
    degree: "",
    field: "",
    year: "",
  };
}

export function EducationEditor({
  education,
  onChange,
}: {
  education: EducationEntry[];
  onChange: (next: EducationEntry[]) => void;
}) {
  function update(id: string, patch: Partial<EducationEntry>) {
    onChange(education.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  function remove(id: string) {
    onChange(education.filter((e) => e.id !== id));
  }

  return (
    <div className="flex flex-col gap-3">
      {education.map((edu) => (
        <div
          key={edu.id}
          className="grid grid-cols-[1fr_1fr_1fr_80px_auto] gap-2 items-center"
        >
          <input
            value={edu.institution}
            onChange={(e) =>
              update(edu.id, { institution: e.target.value })
            }
            placeholder="Institution"
            className="input text-sm"
          />
          <input
            value={edu.degree}
            onChange={(e) => update(edu.id, { degree: e.target.value })}
            placeholder="Degree"
            className="input text-sm"
          />
          <input
            value={edu.field}
            onChange={(e) => update(edu.id, { field: e.target.value })}
            placeholder="Field"
            className="input text-sm"
          />
          <input
            value={edu.year}
            onChange={(e) => update(edu.id, { year: e.target.value })}
            placeholder="Year"
            className="input text-sm"
          />
          <button
            type="button"
            onClick={() => remove(edu.id)}
            className="text-ink-300 hover:text-danger text-sm px-1"
            aria-label="Remove education entry"
          >
            ×
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...education, newEducation()])}
        className="self-start text-sm font-medium text-accent hover:text-accent-strong"
      >
        + Add education
      </button>
    </div>
  );
}
