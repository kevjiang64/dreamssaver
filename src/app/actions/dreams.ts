"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ensureTagIds } from "@/lib/db/tagHelpers";
import { MOODS, type Mood } from "@/lib/constants";

function parseTags(raw: string | null): string[] {
  if (!raw) return [];
  return [
    ...new Set(
      raw
        .split(/[,#]+/)
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => s.slice(0, 100)),
    ),
  ];
}

function isMood(v: string): v is Mood {
  return (MOODS as readonly string[]).includes(v);
}

export type DreamActionState = { error?: string; dreamId?: string };

export async function createDreamAction(
  _prev: DreamActionState | undefined,
  formData: FormData,
): Promise<DreamActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in to save a dream." };

  await supabase.from("users").upsert(
    { id: user.id, email: user.email ?? "" },
    { onConflict: "id" },
  );

  const description = (formData.get("description") as string)?.trim() ?? "";
  if (!description) return { error: "Please describe your dream." };

  const dreamDateRaw = (formData.get("dream_date") as string) || "";
  const dream_date = dreamDateRaw || new Date().toISOString().slice(0, 10);

  const titleRaw = (formData.get("title") as string)?.trim();
  const title = titleRaw || null;

  const moodRaw = (formData.get("mood_upon_waking") as string) || "Neutral";
  const mood_upon_waking = isMood(moodRaw) ? moodRaw : "Neutral";

  const is_lucid = formData.get("is_lucid") === "on";

  const tags = parseTags((formData.get("tags") as string) || null);

  const { data: dream, error } = await supabase
    .from("dreams")
    .insert({
      user_id: user.id,
      description,
      dream_date,
      title,
      mood_upon_waking,
      is_lucid,
    })
    .select("id")
    .single();

  if (error || !dream) {
    return { error: error?.message ?? "Could not save your dream." };
  }

  if (tags.length > 0) {
    const tagIds = await ensureTagIds(supabase, user.id, tags);
    if (tagIds.length > 0) {
      await supabase.from("dream_tags").insert(
        tagIds.map((tag_id) => ({ dream_id: dream.id, tag_id })),
      );
    }
  }

  revalidatePath("/dashboard");
  return { dreamId: dream.id };
}

export async function deleteDreamAction(dreamId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("dreams")
    .delete()
    .eq("id", dreamId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard");
  return {};
}
