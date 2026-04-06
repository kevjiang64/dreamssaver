import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DreamCard } from "@/components/dashboard/DreamCard";
import { InsightQuotaBadge } from "@/components/dashboard/InsightQuotaBadge";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import type { DreamRow } from "@/types/dream";
import { tagNameFromJoin } from "@/lib/format";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("users").upsert(
    { id: user.id, email: user.email ?? "" },
    { onConflict: "id" },
  );

  const { data: profile } = await supabase
    .from("users")
    .select(
      "subscription_status, ai_insights_used_count, ai_insight_limit, stripe_customer_id",
    )
    .eq("id", user.id)
    .single();

  const { data: dreams } = await supabase
    .from("dreams")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const list = (dreams ?? []) as DreamRow[];
  const ids = list.map((d) => d.id);

  const tagsByDream: Record<string, string[]> = {};
  if (ids.length > 0) {
    const { data: linkRows } = await supabase
      .from("dream_tags")
      .select("dream_id, tags(name)")
      .in("dream_id", ids);

    for (const row of linkRows ?? []) {
      const name = tagNameFromJoin(row.tags);
      if (!name) continue;
      if (!tagsByDream[row.dream_id]) tagsByDream[row.dream_id] = [];
      tagsByDream[row.dream_id].push(name);
    }
  }

  const insightSet = new Set<string>();
  if (ids.length > 0) {
    const { data: ins } = await supabase
      .from("dream_insights")
      .select("dream_id")
      .in("dream_id", ids);
    for (const r of ins ?? []) insightSet.add(r.dream_id);
  }

  const isPremium = profile?.subscription_status === "subscribed";
  const used = profile?.ai_insights_used_count ?? 0;
  const limit = profile?.ai_insight_limit ?? 5;

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-foreground text-3xl font-normal sm:text-4xl">
            Your dreams
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-relaxed">
            A soft archive of what your mind painted overnight. Tap a card to read
            the full entry and optional AI reflections.
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 sm:items-end">
          <InsightQuotaBadge
            isPremium={isPremium}
            insightsUsed={used}
            insightLimit={limit}
          />
          <Link
            href="/dashboard/new"
            className={cn(buttonVariants({ size: "default" }))}
          >
            Record new dream
          </Link>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="border-border/50 bg-card/50 rounded-2xl border border-dashed py-16 text-center">
          <p className="text-muted-foreground text-sm">
            You have not recorded a dream yet. When you are ready, add one from the
            button above—or return to the home page to capture your first memory.
          </p>
        </div>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2">
          {list.map((dream) => (
            <li key={dream.id}>
              <DreamCard
                dream={dream}
                tags={tagsByDream[dream.id] ?? []}
                hasInsight={insightSet.has(dream.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
