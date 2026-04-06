import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe/client";
import { createServiceClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !secret) {
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    const supabase = createServiceClient();
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id;
        const customerId =
          typeof session.customer === "string" ? session.customer : null;
        if (userId && customerId) {
          await supabase
            .from("users")
            .update({
              subscription_status: "subscribed",
              stripe_customer_id: customerId,
            })
            .eq("id", userId);
        }
        break;
      }
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        let userId = sub.metadata?.supabase_user_id;
        const customerId =
          typeof sub.customer === "string"
            ? sub.customer
            : sub.customer?.id ?? null;
        if (!userId && customerId) {
          const { data: row } = await supabase
            .from("users")
            .select("id")
            .eq("stripe_customer_id", customerId)
            .maybeSingle();
          userId = row?.id;
        }
        if (!userId) break;
        const status = sub.status;
        if (status === "active" || status === "trialing") {
          await supabase
            .from("users")
            .update({ subscription_status: "subscribed" })
            .eq("id", userId);
        } else if (status === "past_due") {
          await supabase
            .from("users")
            .update({ subscription_status: "past_due" })
            .eq("id", userId);
        } else if (status === "canceled" || status === "unpaid") {
          await supabase
            .from("users")
            .update({ subscription_status: "cancelled" })
            .eq("id", userId);
        }
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        let userId = sub.metadata?.supabase_user_id;
        const customerId =
          typeof sub.customer === "string"
            ? sub.customer
            : sub.customer?.id ?? null;
        if (!userId && customerId) {
          const { data: row } = await supabase
            .from("users")
            .select("id")
            .eq("stripe_customer_id", customerId)
            .maybeSingle();
          userId = row?.id;
        }
        if (userId) {
          await supabase
            .from("users")
            .update({ subscription_status: "free" })
            .eq("id", userId);
        }
        break;
      }
      default:
        break;
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Webhook handler error";
    if (message.includes("Missing Supabase")) {
      return NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 500 },
      );
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
