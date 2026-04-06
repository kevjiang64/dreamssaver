"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { generateDreamInsight, GEMINI_MODEL_ID } from "@/lib/ai/gemini";
import type { Mood } from "@/lib/constants";

export type InsightActionResult =
  | { ok: true; already?: boolean }
  | { error: "unauthorized" | "not_found" | "limit" | "gemini" | string };

export async function generateInsightAction(
  dreamId: string,
): Promise<InsightActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "unauthorized" };

  const { data: profile } = await supabase
    .from("users")
    .select(
      "subscription_status, ai_insights_used_count, ai_insight_limit",
    )
    .eq("id", user.id)
    .single();

  const { data: dream } = await supabase
    .from("dreams")
    .select("id, description, mood_upon_waking, is_lucid")
    .eq("id", dreamId)
    .eq("user_id", user.id)
    .single();

  if (!dream) return { error: "not_found" };

  const { data: existing } = await supabase
    .from("dream_insights")
    .select("id")
    .eq("dream_id", dreamId)
    .maybeSingle();

  if (existing) return { ok: true, already: true };

  const isPremium = profile?.subscription_status === "subscribed";
  const used = profile?.ai_insights_used_count ?? 0;
  const limit = profile?.ai_insight_limit ?? 5;
  if (!isPremium && used >= limit) return { error: "limit" };

  let insightText: string;
  try {
    insightText = await generateDreamInsight(
      dream.description,
      dream.mood_upon_waking as Mood,
      dream.is_lucid,
    );
  } catch {
    return { error: "gemini" };
  }

  const { error: insertErr } = await supabase.from("dream_insights").insert({
    dream_id: dreamId,
    insight_text: insightText,
    ai_model_version: GEMINI_MODEL_ID,
  });

  if (insertErr) return { error: insertErr.message };

  if (!isPremium) {
    await supabase
      .from("users")
      .update({ ai_insights_used_count: used + 1 })
      .eq("id", user.id);
  }

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/${dreamId}`);
  return { ok: true };
}
