import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { InsightPanel } from "@/components/insights/InsightPanel";
import { formatDreamDate, tagNameFromJoin } from "@/lib/format";
import type { DreamRow } from "@/types/dream";

type PageProps = { params: Promise<{ dreamId: string }> };

export default async function DreamDetailPage({ params }: PageProps) {
  const { dreamId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: dream } = await supabase
    .from("dreams")
    .select("*")
    .eq("id", dreamId)
    .eq("user_id", user.id)
    .single();

  if (!dream) notFound();

  const row = dream as DreamRow;

  const { data: linkRows } = await supabase
    .from("dream_tags")
    .select("tags(name)")
    .eq("dream_id", dreamId);

  const tags =
    linkRows?.map((r) => tagNameFromJoin(r.tags)).filter((t): t is string => Boolean(t)) ??
    [];

  const { data: insight } = await supabase
    .from("dream_insights")
    .select("insight_text")
    .eq("dream_id", dreamId)
    .maybeSingle();

  const { data: profile } = await supabase
    .from("users")
    .select(
      "subscription_status, ai_insights_used_count, ai_insight_limit",
    )
    .eq("id", user.id)
    .single();

  const isPremium = profile?.subscription_status === "subscribed";
  const used = profile?.ai_insights_used_count ?? 0;
  const limit = profile?.ai_insight_limit ?? 5;

  const title = row.title?.trim() || "Untitled dream";

  return (
    <div className="space-y-10">
      <div>
        <Link
          href="/dashboard"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "mb-4 -ml-2",
          )}
        >
          ← All dreams
        </Link>
        <h1 className="font-heading text-foreground text-3xl font-normal sm:text-4xl">
          {title}
        </h1>
        <div className="text-muted-foreground mt-4 flex flex-wrap items-center gap-2 text-sm">
          <time dateTime={row.dream_date}>{formatDreamDate(row.dream_date)}</time>
          <Badge variant="secondary">{row.mood_upon_waking}</Badge>
          {row.is_lucid && <Badge variant="outline">Lucid</Badge>}
        </div>
        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((t) => (
              <span
                key={t}
                className="bg-muted/80 text-muted-foreground rounded-full px-3 py-1 text-xs"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      <section className="space-y-3">
        <h2 className="font-heading text-lg">Dream</h2>
        <div className="border-border/50 bg-card/60 rounded-xl border p-6 shadow-sm">
          <p className="text-foreground whitespace-pre-wrap text-base leading-relaxed">
            {row.description}
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-lg">Gemini insight</h2>
        <InsightPanel
          dreamId={dreamId}
          initialInsight={insight?.insight_text ?? null}
          isPremium={isPremium}
          insightsUsed={used}
          insightLimit={limit}
        />
      </section>
    </div>
  );
}
