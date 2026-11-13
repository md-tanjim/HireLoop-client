import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {

  
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  console.log("Session in proxy:", session?.user);

  if (!session) {
    const loginUrl = new URL("/signin", request.url);

    // Save the original requested URL
    loginUrl.searchParams.set(
      "callbackUrl",
      request.nextUrl.pathname + request.nextUrl.search
    );

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/browse-jobs/:path+",
  ],
};