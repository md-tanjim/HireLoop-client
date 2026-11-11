
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {

  // Get the currently logged-in user
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // If not logged in, redirect to signin
  if (!session) {
    redirect("/signin?callbackUrl=/dashboard");
  }

  // Get the user's role
  const role = session.user.role;

  // Redirect according to role
  switch (role) {
    case "seeker":
      redirect("/dashboard/seeker");

    case "recruiter":
      redirect("/dashboard/recruiter");

    case "admin":
      redirect("/dashboard/admin");

    default:
      redirect("/");
  }
}
