// import { createAuthClient } from "better-auth/react"
// import { auth } from "./auth";
// import { adminClient } from "better-auth/client/plugins"
// import { inferAdditionalFields } from "better-auth/client/plugins";
// export const authClient = createAuthClient({
//     /** The base URL of the server (optional if you're using the same domain) */
//     baseURL: process.env.BETTER_AUTH_URL,
//     plugins: [inferAdditionalFields<typeof auth>(), adminClient()],
// });

// export const { signIn, signUp, useSession } = authClient;


import { createAuthClient } from "better-auth/react";

import {
  adminClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";

import type { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,

  plugins: [
    inferAdditionalFields<typeof auth>(),
    adminClient(),
  ],
});

// Export commonly used authentication methods.
export const {
  signIn,
  signUp,
  useSession,
} = authClient;
