"use client";

import { useState } from "react";
import type { ResumeContent } from "@/types/resume";
import { TagInput } from "@/components/TagInput";
import { ProjectsEditor } from "@/components/ProjectsEditor";
import { ExperienceEditor } from "@/components/ExperienceEditor";
import { EducationEditor } from "@/components/EducationEditor";
import { ResumeUpload } from "@/components/ResumeUpload";

type SaveState = "idle" | "saving" | "saved" | "error";

export function ResumeEditor({
  resumeId,
  initial,
  title = "Master Resume",
  subtitle = "Kept as structured data so match scoring and suggestions can target specific projects and bullets, not just a text blob.",
  showUpload = true,
}: {
  resumeId: string;
  initial: ResumeContent;
  title?: string;
  subtitle?: string;
  showUpload?: boolean;
}) {
  const [content, setContent] = useState<ResumeContent>(initial);
  const [saveState, setSaveState] = useState<SaveState>("idle");

  const hasExistingContent =
    content.skills.length > 0 ||
    content.projects.length > 0 ||
    content.experience.length > 0;

  function patch<K extends keyof ResumeContent>(
    key: K,
    value: ResumeContent[K]
  ) {
    setContent((prev) => ({ ...prev, [key]: value }));
    setSaveState("idle");
  }

  async function handleSave() {
    setSaveState("saving");
    try {
      const res = await fetch(`/api/resume/${resumeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-lg font-semibold">{title}</h1>
        <SaveButton state={saveState} onClick={handleSave} />
      </div>
      <p className="text-sm text-ink-400 mb-8">{subtitle}</p>

      {showUpload && (
        <ResumeUpload
          hasExistingContent={hasExistingContent}
          onParsed={(parsed) => {
            setContent(parsed);
            setSaveState("idle");
          }}
        />
      )}

      <Section title="Summary">
        <textarea
          value={content.summary}
          onChange={(e) => patch("summary", e.target.value)}
          rows={3}
          className="input text-sm"
          placeholder="A short professional summary..."
        />
      </Section>

      <Section title="Skills">
        <TagInput
          value={content.skills}
          onChange={(skills) => patch("skills", skills)}
          placeholder="Add a skill and press Enter"
        />
      </Section>

      <Section title="Projects">
        <ProjectsEditor
          projects={content.projects}
          onChange={(projects) => patch("projects", projects)}
        />
      </Section>

      <Section title="Experience">
        <ExperienceEditor
          experience={content.experience}
          onChange={(experience) => patch("experience", experience)}
        />
      </Section>

      <Section title="Education">
        <EducationEditor
          education={content.education}
          onChange={(education) => patch("education", education)}
        />
      </Section>

      <div className="flex justify-end pb-4">
        <SaveButton state={saveState} onClick={handleSave} />
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <h2 className="text-sm font-medium text-ink-900 mb-3">{title}</h2>
      {children}
    </div>
  );
}

function SaveButton({
  state,
  onClick,
}: {
  state: SaveState;
  onClick: () => void;
}) {
  const labels: Record<SaveState, string> = {
    idle: "Save changes",
    saving: "Saving...",
    saved: "Saved",
    error: "Retry save",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={state === "saving"}
      className={`text-sm font-medium rounded-md px-4 py-2 transition-colors disabled:opacity-60 ${
        state === "error"
          ? "bg-danger text-white hover:bg-danger/90"
          : "bg-accent text-white hover:bg-accent-strong"
      }`}
    >
      {labels[state]}
    </button>
  );
}
