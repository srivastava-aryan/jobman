"use client";

export function BulletListEditor({
  bullets,
  onChange,
}: {
  bullets: string[];
  onChange: (next: string[]) => void;
}) {
  function update(index: number, text: string) {
    const next = [...bullets];
    next[index] = text;
    onChange(next);
  }

  function remove(index: number) {
    onChange(bullets.filter((_, i) => i !== index));
  }

  function add() {
    onChange([...bullets, ""]);
  }

  return (
    <div className="flex flex-col gap-1.5">
      {bullets.map((bullet, i) => (
        <div key={i} className="flex items-start gap-2">
          <span className="text-ink-300 text-sm mt-2">–</span>
          <textarea
            value={bullet}
            onChange={(e) => update(i, e.target.value)}
            rows={2}
            className="input text-sm flex-1"
            placeholder="Describe the impact, tools used, and outcome..."
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="text-ink-300 hover:text-danger text-sm mt-2"
            aria-label="Remove bullet"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="self-start text-xs font-medium text-accent hover:text-accent-strong mt-1"
      >
        + Add bullet
      </button>
    </div>
  );
}
