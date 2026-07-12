import { ScoreBadge } from "@/components/ScoreBadge";

interface AnalysisPanelProps {
  overallScore: number;
  hardMatchScore: number;
  semanticScore: number;
  matchedSkills: string[];
  missingSkills: string[];
}

export function AnalysisPanel({
  overallScore,
  hardMatchScore,
  semanticScore,
  matchedSkills,
  missingSkills,
}: AnalysisPanelProps) {
  return (
    <div className="bg-surface border border-border rounded-card p-5">
      <div className="flex items-center gap-4 mb-5">
        <ScoreBadge score={overallScore} />
        <div>
          <div className="text-sm font-medium">Overall match</div>
          <div className="text-xs text-ink-400">
            Hard skill match{" "}
            <span className="data-num">{Math.round(hardMatchScore)}</span>
            {" · "}
            Semantic fit{" "}
            <span className="data-num">{Math.round(semanticScore)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <h3 className="text-xs font-medium text-ink-600 mb-2">
            Matched skills
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {matchedSkills.length === 0 && (
              <span className="text-xs text-ink-300">None yet</span>
            )}
            {matchedSkills.map((s) => (
              <span
                key={s}
                className="text-xs font-mono bg-accent-soft text-accent-strong rounded px-2 py-0.5"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xs font-medium text-ink-600 mb-2">
            Missing skills
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {missingSkills.length === 0 && (
              <span className="text-xs text-ink-300">
                None — full coverage
              </span>
            )}
            {missingSkills.map((s) => (
              <span
                key={s}
                className="text-xs font-mono bg-warn-soft text-warn rounded px-2 py-0.5"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
