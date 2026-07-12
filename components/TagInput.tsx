"use client";

import { useState } from "react";
import { cleanTag, dedupeTags } from "@/lib/normalize";

export function TagInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  function commit() {
    const cleaned = cleanTag(draft);
    if (cleaned) {
      onChange(dedupeTags([...value, cleaned]));
    }
    setDraft("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit();
    } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  function remove(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  return (
    <div className="flex flex-wrap gap-1.5 items-center border border-border rounded-md px-2.5 py-2 bg-white focus-within:border-accent focus-within:ring-2 focus-within:ring-accent-soft">
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 bg-accent-soft text-accent-strong text-xs font-mono rounded px-2 py-0.5"
        >
          {tag}
          <button
            type="button"
            onClick={() => remove(tag)}
            className="hover:text-danger leading-none"
            aria-label={`Remove ${tag}`}
          >
            ×
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commit}
        placeholder={value.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[100px] text-sm outline-none py-0.5"
      />
    </div>
  );
}
