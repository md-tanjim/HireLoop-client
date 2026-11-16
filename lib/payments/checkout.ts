
import "server-only";

import { stripe } from "@/lib/stripe";
import {
  PLAN_CATALOG,
  type UserRole,
} from "@/lib/billing/plan-catalog";

type CreateCheckoutSessionParams = {
  userId: string;
  email: string;
  accountType: UserRole;
  appUrl: string;
};

export async function createCheckoutSession({
  userId,
  email,
  accountType,
  appUrl,
}: CreateCheckoutSessionParams) {

  // 1. Determine the correct Pro plan from the user's account type.
  const planId =
    accountType === "seeker"
      ? "seeker_pro"
      : "recruiter_pro";

  // 2. Get the plan from the central plan catalog.
  const plan = PLAN_CATALOG[planId];

  // 3. Ensure this is a paid subscription plan.
  if (
    plan.billing.type !== "subscription" ||
    !plan.billing.stripePriceId
  ) {
    throw new Error("Invalid subscription plan configuration.");
  }

  // 4. Prepare metadata to identify the HireLoop user and plan.
  const metadata = {
    userId,
    accountType,
    planId,
  };

  // 5. Create the Stripe Checkout Session.
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",

    line_items: [
      {
        price: plan.billing.stripePriceId,
        quantity: 1,
      },
    ],

    customer_email: email,

    client_reference_id: userId,

    metadata,

    // Attach the same metadata to the resulting subscription.
    subscription_data: {
      metadata,
    },

    submit_type: "subscribe",

    success_url:
      `${appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,

    cancel_url:
      `${appUrl}/payment?canceled=true`,
  });

  if (!session.url) {
    throw new Error("Stripe did not return a Checkout URL.");
  }

  return session;
}
