import React from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Building2,
  Check,
  CreditCard,
  Lock,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GetSessionServer } from "@/lib/api/getSession";
import { redirect } from "next/navigation";
import { PLAN_CATALOG } from "@/lib/billing/plan-catalog";

type PaymentPageProps = {
  searchParams: Promise<{
    canceled?: string;
    success?: string;
  }>;
};


export default async function PaymentPage({ searchParams }: PaymentPageProps) {
  

  const { canceled } = await searchParams;

// Get the logged-in user.
const userSession = await GetSessionServer();

if (!userSession?.user) {
  redirect("/signin");
}

const accountType = userSession.user.accountType;

if (
  accountType !== "seeker" &&
  accountType !== "recruiter"
) {
  redirect("/dashboard");
}

// Determine the correct Pro plan.
const planId =
  accountType === "seeker"
    ? "seeker_pro"
    : "recruiter_pro";

const plan = PLAN_CATALOG[planId];

// Prepare the information displayed on the page.
const selectedPlan = {
  id: plan.id,

  name:
    accountType === "seeker"
      ? "Seeker Pro"
      : "Recruiter Pro",

  badge: "Pro Plan",

  billingCycle: "Monthly subscription",

  price: plan.billing.amountCents / 100,

  tax: 0,

  description:
    accountType === "seeker"
      ? "Unlock unlimited job applications, unlimited saved jobs and additional resume storage."
      : "Expand your hiring capacity with up to 10 active job listings.",

  features:
    accountType === "seeker"
      ? [
          "Unlimited job applications",
          "Unlimited saved jobs",
          "Store up to 5 resumes",
          "Access all basic job-search features",
        ]
      : [
          "Publish up to 10 active job listings",
          "Manage job listings and applications",
          "Access applicant resumes",
          "Manage your company profile",
        ],
};

const totalAmount = selectedPlan.price + selectedPlan.tax;


   if (canceled) {
    console.log(
      'Order canceled -- continue to shop around and check out when you\'re ready.'
    )
  }

  return (
    <div className="min-h-screen bg-[#111112] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        {/* Top Back Navigation */}
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-medium text-[#92929c] transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Link>
        </div>

        {/* Page Header */}
        <div className="border-b border-white/[0.06] pb-6">
          <div className="mb-2 flex items-center gap-1.5 text-xs text-[#898993]">
            <span>Billing & Plans</span>
            <span>/</span>
            <span className="text-[#c4c4d0]">Order Preview</span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Review Your Order
          </h1>
          <p className="mt-1 text-xs text-[#92929c] sm:text-sm">
            Confirm your package details below before proceeding to secure
            Stripe Checkout.
          </p>
        </div>

        {/* Stripe Canceled Banner (Shown when redirected back with ?canceled=true) */}
        {canceled && (
          <div className="flex items-start gap-3 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-xs text-yellow-300 sm:text-sm">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-yellow-400" />
            <div>
              <p className="font-semibold text-yellow-200">
                Checkout Canceled
              </p>
              <p className="mt-0.5 text-xs text-yellow-300/80">
                Your payment was not processed and you have not been charged.
                Review your order below and try again whenever you are ready.
              </p>
            </div>
          </div>
        )}

        {/* Main 2-Column Checkout Preview Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Left Column: Product / Package Details (3/5 width on desktop) */}
          <div className="space-y-6 lg:col-span-3">
            <Card className="border-[#202024] bg-[#151517] text-white shadow-none">
              <CardContent className="p-6 sm:p-8">
                {/* Product Header (Matches Stripe's .product & .description structure) */}
                <div className="flex flex-col justify-between gap-4 border-b border-[#202024] pb-6 sm:flex-row sm:items-start">
                  <div className="flex items-start gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-[#6861ff]/15">
                      <Zap className="size-6 text-[#aaa5ff]" />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base font-semibold text-white sm:text-lg">
                          {selectedPlan.name}
                        </h2>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#5148bc]/25 px-2.5 py-0.5 text-[11px] font-medium text-[#bdb7ff]">
                          <Sparkles className="size-3" />
                          {selectedPlan.badge}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-[#92929c]">
                        {selectedPlan.billingCycle}
                      </p>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-2xl font-bold text-white">
                      ${selectedPlan.price.toFixed(2)}
                    </p>
                    <p className="text-[11px] text-[#777780]">USD</p>
                  </div>
                </div>

                {/* Package Description */}
                <div className="py-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#777780]">
                    Package Overview
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#92929c]">
                    {selectedPlan.description}
                  </p>

                  {/* Included Features List */}
                  <h3 className="mt-6 text-xs font-semibold uppercase tracking-wider text-[#777780]">
                    What&apos;s Included
                  </h3>
                  <ul className="mt-3.5 space-y-3">
                    {selectedPlan.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-sm text-[#dedee4]"
                      >
                        <div className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                          <Check className="size-3" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recruiter Trust Highlights */}
                <div className="grid grid-cols-1 gap-3 border-t border-[#202024] pt-6 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-lg border border-[#25252b] bg-[#202023] p-3">
                    <Building2 className="size-4 shrink-0 text-[#bcb6ff]" />
                    <div>
                      <p className="text-xs font-medium text-white">
                        Instant Activation
                      </p>
                      <p className="text-[11px] text-[#92929c]">
                        Unlocked immediately after payment
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg border border-[#25252b] bg-[#202023] p-3">
                    <BadgeCheck className="size-4 shrink-0 text-emerald-400" />
                    <div>
                      <p className="text-xs font-medium text-white">
                        Verified Recruiter Status
                      </p>
                      <p className="text-[11px] text-[#92929c]">
                        Stand out to top engineering talent
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Order Summary & Stripe Checkout Trigger (2/5 width on desktop) */}
          <div className="space-y-6 lg:col-span-2">
            <Card className="border-[#202024] bg-[#151517] text-white shadow-none">
              <CardContent className="p-6">
                <h2 className="text-base font-semibold text-white">
                  Order Summary
                </h2>
                <p className="mt-1 text-xs text-[#92929c]">
                  Review your total before redirecting to Stripe.
                </p>

                {/* Line Items Breakdown */}
                <div className="mt-6 space-y-3 border-b border-[#202024] pb-5 text-xs">
                  <div className="flex items-center justify-between text-[#c4c4d0]">
                    <span className="flex items-center gap-2">
                      <Briefcase className="size-3.5 text-[#858590]" />
                      {selectedPlan.name}
                    </span>
                    <span className="font-medium text-white">
                      ${selectedPlan.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[#92929c]">
                    <span>Quantity</span>
                    <span>1</span>
                  </div>

                  <div className="flex items-center justify-between text-[#92929c]">
                    <span>Estimated Tax</span>
                    <span>${selectedPlan.tax.toFixed(2)}</span>
                  </div>
                </div>

                {/* Final Total */}
                <div className="flex items-baseline justify-between py-5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#92929c]">
                    Total Due
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-white">
                      ${totalAmount.toFixed(2)}
                    </span>
                    <span className="ml-1 text-xs text-[#777780]">USD</span>
                  </div>
                </div>

                {/* =========================================================
                    STRIPE CHECKOUT FORM SLOT
                    Later, connect this form's action to your API route
                    ("/api/checkout_sessions") or a Next.js Server Action.
                   ========================================================= */}
                <form action="/api/checkout_sessions" method="POST">
                  {/* Optional: Pass the price ID or plan ID to your backend */}    
                  

                  <Button
                    type="submit"
                    role="link"
                    id="checkout-button"
                    className="h-11 w-full rounded-lg bg-[#5b5bd6] text-sm font-semibold text-white shadow-lg shadow-[#5b5bd6]/20 transition-colors hover:bg-[#6a63e8]"
                  >
                    <CreditCard className="mr-2 size-4" />
                    Proceed to Checkout
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </form>

                {/* Security & Stripe Branding Footer */}
                <div className="mt-5 space-y-3 border-t border-[#202024] pt-5">
                  <div className="flex items-center justify-center gap-2 text-[11px] text-[#92929c]">
                    <Lock className="size-3.5 text-emerald-400" />
                    <span>Guaranteed safe & secure checkout</span>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 rounded-lg border border-[#25252b] bg-[#202023] py-2 text-[11px] text-[#898993]">
                    <ShieldCheck className="size-3.5 text-[#aaa5ff]" />
                    <span>
                      Powered by{" "}
                      <strong className="font-semibold text-white">
                        Stripe
                      </strong>{" "}
                      256-bit SSL encryption
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}