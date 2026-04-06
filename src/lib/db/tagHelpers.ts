import type { SupabaseClient } from "@supabase/supabase-js";

export async function ensureTagIds(
  supabase: SupabaseClient,
  userId: string,
  names: string[],
): Promise<string[]> {
  const ids: string[] = [];
  const seen = new Set<string>();

  const { data: existingRows } = await supabase
    .from("tags")
    .select("id, name")
    .eq("user_id", userId);

  const byLower = new Map(
    (existingRows ?? []).map((r) => [r.name.toLowerCase(), r.id] as const),
  );

  for (const raw of names) {
    const trimmed = raw.trim().slice(0, 100);
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    let id = byLower.get(key);
    if (!id) {
      const { data: inserted, error } = await supabase
        .from("tags")
        .insert({ user_id: userId, name: trimmed })
        .select("id")
        .single();
      if (error) {
        const { data: retry } = await supabase
          .from("tags")
          .select("id, name")
          .eq("user_id", userId);
        const row = retry?.find((r) => r.name.toLowerCase() === key);
        id = row?.id;
      } else {
        id = inserted?.id;
      }
      if (id) byLower.set(key, id);
    }
    if (id) ids.push(id);
  }

  return ids;
}
