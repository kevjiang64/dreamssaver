"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  createCheckoutSessionAction,
  createPortalSessionAction,
} from "@/app/actions/stripe";
import { PREMIUM_PRICE_LABEL } from "@/lib/constants";

type Props = {
  isPremium: boolean;
  hasStripeCustomer: boolean;
};

export function SubscriptionManage({
  isPremium,
  hasStripeCustomer,
}: Props) {
  const [pending, start] = useTransition();

  function checkout() {
    start(async () => {
      const res = await createCheckoutSessionAction();
      if ("error" in res) {
        toast.error(res.error);
        return;
      }
      window.location.href = res.url;
    });
  }

  function portal() {
    start(async () => {
      const res = await createPortalSessionAction();
      if ("error" in res) {
        toast.error(res.error);
        return;
      }
      window.location.href = res.url;
    });
  }

  return (
    <div className="flex flex-wrap gap-3">
      {!isPremium && (
        <Button disabled={pending} onClick={checkout}>
          {pending ? "Redirecting…" : `Subscribe — ${PREMIUM_PRICE_LABEL}`}
        </Button>
      )}
      {isPremium && hasStripeCustomer && (
        <Button variant="secondary" disabled={pending} onClick={portal}>
          {pending ? "Opening…" : "Manage billing in Stripe"}
        </Button>
      )}
    </div>
  );
}
