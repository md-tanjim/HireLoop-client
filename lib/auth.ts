
// import { betterAuth } from "better-auth";
// import { MongoClient } from "mongodb";
// import { mongodbAdapter } from "@better-auth/mongo-adapter";
// import {
//   APIError,
//   createAuthMiddleware,
// } from "better-auth/api";
// import { admin } from "better-auth/plugins"


// const client = new MongoClient(process.env.MONGO_DB_URL as string);
// const db = client.db("hireloopdb");

// export const auth = betterAuth({
//     baseURL: process.env.BETTER_AUTH_URL,

//   database: mongodbAdapter(db, {
//     client,
//   }),

//    emailAndPassword: { 
//     enabled: true, 
//   }, 

//   plugins:[
//     admin(),
//   ],

//    user: {
//   additionalFields: {
//     role: {
//       type: ["seeker", "recruiter", "admin"],
//       required: false,
//       defaultValue: "seeker",
//       input: true,
//     },

//         // Add status here
//     status: {
//       type: ["active", "suspended"],
//       required: false,
//       defaultValue: "active",
//       input: false,
//       returned: true,
//     },

//   },
// },


// hooks: {
//   before: createAuthMiddleware(async (ctx) => {
//     // Only allow seeker and recruiter during public email signup.
//     if (ctx.path === "/sign-up/email") {
//       const requestedRole = ctx.body?.role;

//       if (
//         requestedRole !== "seeker" &&
//         requestedRole !== "recruiter"
//       ) {
//         throw new APIError("BAD_REQUEST", {
//           message: "Invalid account role.",
//         });
//       }
//     }

//     // Prevent users from changing their own role later.
//     if (
//       ctx.path === "/update-user" &&
//       ctx.body &&
//       "role" in ctx.body
//     ) {
//       throw new APIError("FORBIDDEN", {
//         message: "You cannot change your account role.",
//       });
//     }
//   }),
// },
  
// });




import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import {
  APIError,
  createAuthMiddleware,
} from "better-auth/api";
import { admin } from "better-auth/plugins";

// --------------------------------------------------
// 1. MongoDB connection
// --------------------------------------------------

const mongoUrl = process.env.MONGO_DB_URL;

if (!mongoUrl) {
  throw new Error("MONGO_DB_URL is not defined.");
}

const client = new MongoClient(mongoUrl);
const db = client.db("hireloopdb");

// --------------------------------------------------
// 2. Better Auth configuration
// --------------------------------------------------

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,

  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },

  // --------------------------------------------------
  // 3. Additional user fields
  // --------------------------------------------------

  user: {
    additionalFields: {
      // Type of HireLoop account.
      accountType: {
        type: ["seeker", "recruiter", "admin"],
        required: false,
        defaultValue: "seeker",
        input: true,
        returned: true,
      },

      // Current HireLoop plan.
      // Only the server can modify this field.
      planId: {
        type: [
          "seeker_free",
          "seeker_pro",
          "recruiter_free",
          "recruiter_pro",
        ],
        required: false,
        input: false,
        returned: true,
      },

      // Stripe customer ID.
      stripeCustomerId: {
        type: "string",
        required: false,
        input: false,
        returned: false,
      },

      // Stripe subscription ID.
      stripeSubscriptionId: {
        type: "string",
        required: false,
        input: false,
        returned: false,
      },

      // Stripe Price ID.
      stripePriceId: {
        type: "string",
        required: false,
        input: false,
        returned: false,
      },

      // Current subscription status.
      subscriptionStatus: {
        type: "string",
        required: false,
        defaultValue: "none",
        input: false,
        returned: true,
      },

      // Current subscription billing period.
      currentPeriodStart: {
        type: "date",
        required: false,
        input: false,
        returned: true,
      },

      currentPeriodEnd: {
        type: "date",
        required: false,
        input: false,
        returned: true,
      },

      // Whether cancellation is scheduled.
      cancelAtPeriodEnd: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
        returned: true,
      },
    },
  },

  // --------------------------------------------------
  // 4. Admin plugin
  // --------------------------------------------------

  plugins: [
    admin({
      defaultRole: "user",
      adminRoles: ["admin"],

      bannedUserMessage:
        "Your HireLoop account has been suspended. Please contact support if you believe this is a mistake.",
    }),
  ],

  // --------------------------------------------------
  // 5. Initialize the user's Free plan
  // --------------------------------------------------

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Preserve administrator accounts.
          if (user.role === "admin") {
            return {
              data: user,
            };
          }

          const accountType =
            user.accountType === "recruiter"
              ? "recruiter"
              : "seeker";

          const defaultPlan =
            accountType === "recruiter"
              ? "recruiter_free"
              : "seeker_free";

          return {
            data: {
              ...user,

              // All normal accounts receive the Better Auth user role.
              role: "user",

              accountType,
              planId: defaultPlan,

              // Initial billing state.
              subscriptionStatus: "none",
              cancelAtPeriodEnd: false,
            },
          };
        },
      },
    },
  },

  // --------------------------------------------------
  // 6. Security hooks
  // --------------------------------------------------

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      // Public email signup validation.
      if (ctx.path === "/sign-up/email") {
        const accountType = ctx.body?.accountType;

        if (
          accountType !== "seeker" &&
          accountType !== "recruiter"
        ) {
          throw new APIError("BAD_REQUEST", {
            message: "Invalid account type.",
          });
        }

        // Users cannot assign themselves admin privileges.
        if (ctx.body && "role" in ctx.body) {
          throw new APIError("FORBIDDEN", {
            message: "You cannot assign your own authorization role.",
          });
        }
      }

      // Prevent users from changing protected fields
      // through the normal user-update endpoint.
      if (
        ctx.path === "/update-user" &&
        ctx.body
      ) {
        const protectedFields = [
          "role",
          "accountType",
          "planId",
          "stripeCustomerId",
          "stripeSubscriptionId",
          "stripePriceId",
          "subscriptionStatus",
          "currentPeriodStart",
          "currentPeriodEnd",
          "cancelAtPeriodEnd",
        ];

        const attemptedProtectedUpdate =
          protectedFields.some((field) => field in ctx.body!);

        if (attemptedProtectedUpdate) {
          throw new APIError("FORBIDDEN", {
            message:
              "You cannot modify account permissions or billing information.",
          });
        }
      }
    }),
  },
});

