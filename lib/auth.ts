
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import {
  APIError,
  createAuthMiddleware,
} from "better-auth/api";



const client = new MongoClient(process.env.MONGO_DB_URL as string);
const db = client.db("hireloopdb");

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,

  database: mongodbAdapter(db, {
    client,
  }),

   emailAndPassword: { 
    enabled: true, 
  }, 

   user: {
  additionalFields: {
    role: {
      type: ["seeker", "recruiter", "admin"],
      required: false,
      defaultValue: "seeker",
      input: true,
    },
  },
},


hooks: {
  before: createAuthMiddleware(async (ctx) => {
    // Only allow seeker and recruiter during public email signup.
    if (ctx.path === "/sign-up/email") {
      const requestedRole = ctx.body?.role;

      if (
        requestedRole !== "seeker" &&
        requestedRole !== "recruiter"
      ) {
        throw new APIError("BAD_REQUEST", {
          message: "Invalid account role.",
        });
      }
    }

    // Prevent users from changing their own role later.
    if (
      ctx.path === "/update-user" &&
      ctx.body &&
      "role" in ctx.body
    ) {
      throw new APIError("FORBIDDEN", {
        message: "You cannot change your account role.",
      });
    }
  }),
},
  
});