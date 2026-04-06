"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { generateInsightAction } from "@/app/actions/insights";
import Link from "next/link";
import { PREMIUM_PRICE_LABEL } from "@/lib/constants";

type Props = {
  dreamId: string;
  initialInsight: string | null;
  isPremium: boolean;
  insightsUsed: number;
  insightLimit: number;
};

export function InsightPanel({
  dreamId,
  initialInsight,
  isPremium,
  insightsUsed,
  insightLimit,
}: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();

  const remaining = Math.max(0, insightLimit - insightsUsed);
  const canGenerate =
    !initialInsight && (isPremium || remaining > 0);

  function onGenerate() {
    start(async () => {
      const res = await generateInsightAction(dreamId);
      if ("error" in res) {
        if (res.error === "limit") {
          toast.message(
            `You have used all ${insightLimit} free insights. Upgrade for unlimited reflections.`,
          );
          return;
        }
        if (res.error === "gemini_config") {
          toast.error(
            "Gemini API key is missing. Add GEMINI_API_KEY to `.env.local` and restart the dev server.",
          );
          return;
        }
        if (res.error === "gemini_quota") {
          toast.error(
            "The Gemini API free tier quota is exhausted. Generate a new API key at aistudio.google.com/apikey or enable billing on your Google AI project.",
          );
          return;
        }
        if (res.error === "gemini") {
          toast.error(
            "We could not reach the AI service. Confirm GEMINI_API_KEY in `.env.local` and that the Generative Language API is enabled for your key.",
          );
          return;
        }
        toast.error("Something went wrong. Please try again.");
        return;
      }
      if (res.already) {
        toast.message("Insight was already saved for this dream.");
      } else {
        toast.success("Insight ready.");
      }
      router.refresh();
    });
  }

  if (initialInsight) {
    return (
      <div className="space-y-4">
        <div className="border-border/50 bg-card/60 rounded-xl border p-6 shadow-sm">
          <p className="text-foreground whitespace-pre-wrap text-sm leading-relaxed">
            {initialInsight}
          </p>
        </div>
        <p className="text-muted-foreground text-xs leading-relaxed">
          Insights are suggestive, not definitive. Consider what resonates with you
          personally.
        </p>
      </div>
    );
  }

  if (!canGenerate) {
    return (
      <div className="border-border/50 bg-muted/30 space-y-4 rounded-xl border p-6">
        <p className="text-muted-foreground text-sm">
          You have used all {insightLimit} free AI insights. Subscribe for unlimited
          gentle reflections powered by Gemini.
        </p>
        <Link
          href="/settings/subscription"
          className={cn(buttonVariants())}
        >
          Unlock unlimited insights — {PREMIUM_PRICE_LABEL}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!isPremium && (
        <p className="text-muted-foreground text-sm">
          {remaining} of {insightLimit} free AI insights remaining on your account.
        </p>
      )}
      <Button type="button" disabled={pending} onClick={onGenerate}>
        {pending ? "Generating insight…" : "Generate AI insight"}
      </Button>
    </div>
  );
}
