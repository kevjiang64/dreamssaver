import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { PREMIUM_PRICE_LABEL } from "@/lib/constants";

type Props = {
  isPremium: boolean;
  insightsUsed: number;
  insightLimit: number;
};

export function InsightQuotaBadge({
  isPremium,
  insightsUsed,
  insightLimit,
}: Props) {
  if (isPremium) {
    return (
      <Badge variant="secondary" className="font-normal">
        Unlimited AI insights
      </Badge>
    );
  }

  const left = Math.max(0, insightLimit - insightsUsed);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="outline" className="font-normal">
        {left} / {insightLimit} free insights left
      </Badge>
      {left === 0 && (
        <Link
          href="/settings/subscription"
          className={cn(buttonVariants({ size: "sm" }))}
        >
          Upgrade — {PREMIUM_PRICE_LABEL}
        </Link>
      )}
    </div>
  );
}
