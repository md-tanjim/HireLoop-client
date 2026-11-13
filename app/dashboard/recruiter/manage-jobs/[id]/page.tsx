
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";

import { getJobById } from "@/lib/actions/updateJobs";
import UpdateJobForm from "./UpdateJobForm";


type UpdateJobsProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function UpdateJobs({
  params,
}: UpdateJobsProps) {

  const { id } = await params;

  // Validate MongoDB ObjectId format
  if (!/^[a-fA-F0-9]{24}$/.test(id)) {
    notFound();
  }

  // Get authenticated session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Check authentication
  if (!session) {
    redirect(`/signin?callbackUrl=${encodeURIComponent(
      `/dashboard/recruiter/manage-jobs/${id}`
    )}`);
  }

  // Check recruiter role
  if (session.user.role !== "recruiter") {
    redirect("/dashboard");
  }

  // Fetch existing job
  let jobData;

  try {
    jobData = await getJobById(id);
  } catch (error) {
    console.error("Fetch job error:", error);

    if (
      error instanceof Error &&
      error.message.toLowerCase().includes("not found")
    ) {
      notFound();
    }

    throw error;
  }

  // Check whether the logged-in recruiter owns this job
  if (jobData.createdByEmail !== session.user.email) {
    notFound();
  }

  return (
    <UpdateJobForm
      jobId={id}
      initialData={jobData}
    />
  );
}
