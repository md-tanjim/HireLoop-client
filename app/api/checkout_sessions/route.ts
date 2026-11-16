
import { NextResponse } from "next/server";

import { GetSessionServer } from "@/lib/api/getSession";
import { createCheckoutSession } from "@/lib/payments/checkout";

export async function POST() {
  try {
    // 1. Get the application URL.
    const appUrl = process.env.BETTER_AUTH_URL;

    if (!appUrl) {
      throw new Error("BETTER_AUTH_URL is not configured.");
    }

    // 2. Get the currently logged-in user.
    const userSession = await GetSessionServer();

    if (!userSession?.user) {
      return NextResponse.redirect(
        new URL("/signin", appUrl),
        303
      );
    }

    const user = userSession.user;

    // 3. Check the user's account type.
    const accountType = user.accountType;

    if (accountType !== "seeker" && accountType !== "recruiter") {

      return NextResponse.json(
        {
          success: false,
          message: "Invalid account type.",
        },
        { status: 403 }
      );
    }

    // 4. Prevent creating another subscription
    // when the user already has an active subscription.
    if (user.subscriptionStatus === "active") {
      return NextResponse.redirect(
        new URL("/dashboard?billing=already-active", appUrl),
        303
      );
    }

    // 5. Create the correct Checkout Session.
    const session = await createCheckoutSession({
      userId: user.id,
      email: user.email,
      accountType,
      appUrl,
    });

    // 6. Redirect the user to Stripe Checkout.
    console.log(session, "stripe session from app\api\checkout_sessions\route.ts")
    return NextResponse.redirect(session.url, 303);

  } catch (error) {
    console.error("Checkout session creation error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to start checkout.",
      },
      { status: 500 }
    );
  }
}











































// import { NextResponse } from 'next/server'
// import { headers } from 'next/headers'
// import { stripe } from '@/lib/stripe';
// import { GetSessionServer } from '@/lib/api/getSession';



// export async function POST() {

//     const userSession = await GetSessionServer();


//   try {
//     const headersList = await headers()
//     const origin = headersList.get('origin')

//     // Create Checkout Sessions from body params.
//     const session = await stripe.checkout.sessions.create({
//       line_items: [
//         {
//           // Provide the exact Price ID (for example, price_1234) of the product you want to sell

//           //seeker : price_1UbeKePTIoJUS1U7lqwiWmW6
//           //recruiter: price_1UblGBPTIoJUS1U7Hp2pN0Dk

//         //   price: 'price_1UbeKePTIoJUS1U7lqwiWmW6',
//           price: 'price_1UbwikPTIoJUS1U7ZBxdu7LQ',
//           quantity: 1,
//         },
//       ],
//       mode: 'subscription',
//       customer_email: userSession?.user.email,
//       metadata: {
//         customer_Id : userSession?.user.id as string,
//       },
//       success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
//       // Provide a name (for example, hosted_web_0001) to label this Checkout integration and measure its conversion independently
//       integration_identifier: 'HireLoop',
//     });
//     return NextResponse.redirect(session.url as string, 303)
//   } catch (err) {
//       const error = err instanceof Error ? err : new Error(String(err));
//     return NextResponse.json(
//         { error: error.message },
//       { status: 500 }
//     )
//   }
// }