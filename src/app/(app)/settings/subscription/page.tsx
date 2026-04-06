import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionManage } from "@/components/subscriptions/SubscriptionManage";
import { PREMIUM_PRICE_LABEL } from "@/lib/constants";

export default async function SubscriptionPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const params = await searchParams;
  const checkout = params.checkout;

  const { data: profile } = await supabase
    .from("users")
    .select("subscription_status, stripe_customer_id")
    .eq("id", user.id)
    .single();

  const isPremium = profile?.subscription_status === "subscribed";
  const hasCustomer = Boolean(profile?.stripe_customer_id);

  return (
    <div className="space-y-8">
      {checkout === "success" && (
        <p className="border-primary/20 bg-primary/5 text-foreground rounded-lg border px-4 py-3 text-sm">
          Thank you — your subscription is updating. It may take a moment for premium
          access to appear everywhere.
        </p>
      )}
      {checkout === "cancel" && (
        <p className="text-muted-foreground text-sm">
          Checkout was cancelled. You can subscribe whenever you like.
        </p>
      )}

      <Card className="border-border/60 bg-card/80 max-w-xl">
        <CardHeader>
          <CardTitle className="font-heading text-xl">Premium</CardTitle>
          <p className="text-muted-foreground text-sm leading-relaxed">
            The free plan includes unlimited dream storage and five complimentary AI
            reflections. Premium unlocks unlimited Gemini insights for{" "}
            {PREMIUM_PRICE_LABEL}.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-foreground text-2xl font-medium">{PREMIUM_PRICE_LABEL}</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Unlimited AI dream insights · Cancel anytime in the Stripe portal
            </p>
          </div>
          <div className="text-muted-foreground space-y-1 text-sm">
            <p>
              <span className="text-foreground font-medium">Current plan:</span>{" "}
              {isPremium ? "Premium" : "Free"}
            </p>
          </div>
          <SubscriptionManage
            isPremium={isPremium}
            hasStripeCustomer={hasCustomer}
          />
        </CardContent>
      </Card>
    </div>
  );
}
