import { redirect } from "next/navigation";
import { Check } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionManage } from "@/components/subscriptions/SubscriptionManage";
import { PREMIUM_PRICE_LABEL, FREE_AI_INSIGHT_LIMIT } from "@/lib/constants";

const freePlanFeatures = [
  "Unlimited dream storage",
  `${FREE_AI_INSIGHT_LIMIT} free AI insights`,
  "Mood & lucidity tagging",
  "Dream search and archive",
];

const premiumPlanFeatures = [
  "Everything in Free",
  "Unlimited AI insights",
  "Priority Gemini model access",
  "Cancel anytime",
];

export default async function UpgradePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("subscription_status, stripe_customer_id")
    .eq("id", user.id)
    .single();

  const isPremium = profile?.subscription_status === "subscribed";
  const hasCustomer = Boolean(profile?.stripe_customer_id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-foreground text-3xl font-normal">
          Choose your plan
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Start for free, upgrade when you want deeper reflections.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 max-w-2xl">
        {/* Free plan */}
        <Card className={`border-border/60 bg-card/80 ${!isPremium ? "ring-2 ring-primary/40" : ""}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="font-heading text-lg font-normal">Free</CardTitle>
              {!isPremium && (
                <span className="bg-primary/10 text-primary rounded-full px-3 py-0.5 text-xs font-medium">
                  Current plan
                </span>
              )}
            </div>
            <p className="text-foreground text-2xl font-medium">$0</p>
            <p className="text-muted-foreground text-sm">Forever free</p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {freePlanFeatures.map((feature) => (
                <li key={feature} className="text-muted-foreground flex items-start gap-2 text-sm">
                  <Check className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Premium plan */}
        <Card className={`border-border/60 bg-card/80 ${isPremium ? "ring-2 ring-primary/40" : ""}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="font-heading text-lg font-normal">Premium</CardTitle>
              {isPremium && (
                <span className="bg-primary/10 text-primary rounded-full px-3 py-0.5 text-xs font-medium">
                  Current plan
                </span>
              )}
            </div>
            <p className="text-foreground text-2xl font-medium">{PREMIUM_PRICE_LABEL}</p>
            <p className="text-muted-foreground text-sm">Billed monthly · cancel anytime</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {premiumPlanFeatures.map((feature) => (
                <li key={feature} className="text-muted-foreground flex items-start gap-2 text-sm">
                  <Check className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <SubscriptionManage isPremium={isPremium} hasStripeCustomer={hasCustomer} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
