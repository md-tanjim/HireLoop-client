
import "server-only";

// --------------------------------------------------
// 1. Shared types
// --------------------------------------------------

export type UserRole = "seeker" | "recruiter";

export type PlanTier = "free" | "pro";

export type PlanId =
  | "seeker_free"
  | "seeker_pro"
  | "recruiter_free"
  | "recruiter_pro";

// null means unlimited.
export type FeatureLimit = number | null;

// --------------------------------------------------
// 2. Billing types
// --------------------------------------------------

type FreeBilling = {
  type: "free";
  amountCents: 0;
  currency: "usd";
  interval: null;
  stripePriceId: null;
};

type MonthlySubscriptionBilling = {
  type: "subscription";
  amountCents: number;
  currency: "usd";
  interval: "month";
  stripePriceId: string;
};

type PlanBilling = FreeBilling | MonthlySubscriptionBilling;

// --------------------------------------------------
// 3. Feature limit types
// --------------------------------------------------

export type SeekerFeatures = {
  applicationsPerCalendarMonth: FeatureLimit;
  savedJobs: FeatureLimit;
  resumes: number;
};

export type RecruiterFeatures = {
  activeJobListings: number;
};

// --------------------------------------------------
// 4. Plan definition types
// --------------------------------------------------

type BasePlan = {
  id: PlanId;
  name: string;
  tier: PlanTier;
  billing: PlanBilling;
};

export type SeekerPlan = BasePlan & {
  role: "seeker";
  features: SeekerFeatures;
};

export type RecruiterPlan = BasePlan & {
  role: "recruiter";
  features: RecruiterFeatures;
};

export type PlanDefinition = SeekerPlan | RecruiterPlan;

// --------------------------------------------------
// 5. Central plan catalog
// --------------------------------------------------

export const PLAN_CATALOG = {
  // =========================
  // SEEKER PLANS
  // =========================

  seeker_free: {
    id: "seeker_free",
    name: "Seeker Free",
    role: "seeker",
    tier: "free",

    billing: {
      type: "free",
      amountCents: 0,
      currency: "usd",
      interval: null,
      stripePriceId: null,
    },

    features: {
      applicationsPerCalendarMonth: 3,
      savedJobs: 5,
      resumes: 1,
    },
  },

  seeker_pro: {
    id: "seeker_pro",
    name: "Seeker Pro",
    role: "seeker",
    tier: "pro",

    billing: {
      type: "subscription",
      amountCents: 3000,
      currency: "usd",
      interval: "month",
      stripePriceId: "price_1UbwikPTIoJUS1U7ZBxdu7LQ",
      //price_1UbwikPTIoJUS1U7ZBxdu7LQ //per month
    },

    features: {
      applicationsPerCalendarMonth: null,
      savedJobs: null,
      resumes: 5,
    },
  },

  // =========================
  // RECRUITER PLANS
  // =========================

  recruiter_free: {
    id: "recruiter_free",
    name: "Recruiter Free",
    role: "recruiter",
    tier: "free",

    billing: {
      type: "free",
      amountCents: 0,
      currency: "usd",
      interval: null,
      stripePriceId: null,
    },

    features: {
      activeJobListings: 3,
    },
  },

  recruiter_pro: {
    id: "recruiter_pro",
    name: "Recruiter Pro",
    role: "recruiter",
    tier: "pro",

    billing: {
      type: "subscription",
      amountCents: 5000,
      currency: "usd",
      interval: "month",
      stripePriceId: "price_1UblGBPTIoJUS1U7Hp2pN0Dk",
    },

    features: {
      activeJobListings: 10,
    },
  },
} satisfies Record<PlanId, PlanDefinition>;

// --------------------------------------------------
// 6. Default plans by role
// --------------------------------------------------

export const DEFAULT_PLAN_BY_ROLE = {
  seeker: "seeker_free",
  recruiter: "recruiter_free",
} as const satisfies Record<UserRole, PlanId>;

// --------------------------------------------------
// 7. Helper functions
// --------------------------------------------------

export function getPlan(planId: PlanId): PlanDefinition {
  return PLAN_CATALOG[planId];
}

export function getPlanByStripePriceId(priceId: string,): PlanDefinition | undefined {
    return Object.values(PLAN_CATALOG).find(
    (plan) =>
      plan.billing.type === "subscription" && plan.billing.stripePriceId === priceId,
  );
}

export function formatPlanPrice(plan: PlanDefinition): string {
  if (plan.billing.type === "free") {
    return "Free";
  }

  const amount = plan.billing.amountCents / 100;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: plan.billing.currency.toUpperCase(),
  }).format(amount) + "/month";
}
