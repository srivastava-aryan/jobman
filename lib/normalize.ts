/**
 * Basic normalization for skill/tech-stack tags.
 * Trims whitespace, collapses internal spaces, and dedupes case-insensitively
 * while keeping the casing of whichever variant was entered first
 * (e.g. "TypeScript" stays "TypeScript" even if "typescript" is added later).
 *
 * This does NOT do semantic normalization (e.g. "Node" vs "Node.js" vs
 * "NodeJS" are still treated as different tags) — that's better handled by
 * the LLM at match-time, since it requires judgment, not just string rules.
 */
export function cleanTag(raw: string): string {
  return raw.trim().replace(/\s+/g, " ");
}

export function dedupeTags(tags: string[]): string[] {
  const seen = new Map<string, string>(); // lowercase key -> original casing
  for (const raw of tags) {
    const cleaned = cleanTag(raw);
    if (!cleaned) continue;
    const key = cleaned.toLowerCase();
    if (!seen.has(key)) seen.set(key, cleaned);
  }
  return Array.from(seen.values());
}
