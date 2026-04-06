export function formatDreamDate(isoDate: string): string {
  const d = new Date(isoDate + "T12:00:00");
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Normalize Supabase nested `tags` from dream_tags select. */
export function tagNameFromJoin(tags: unknown): string | null {
  if (tags && typeof tags === "object" && !Array.isArray(tags) && "name" in tags) {
    return String((tags as { name: string }).name);
  }
  if (
    Array.isArray(tags) &&
    tags[0] &&
    typeof tags[0] === "object" &&
    "name" in tags[0]
  ) {
    return String((tags[0] as { name: string }).name);
  }
  return null;
}

export function snippet(text: string, max = 160): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return t.slice(0, max).trimEnd() + "…";
}
