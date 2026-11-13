
"use client";

import { useSession } from "@/lib/auth-client";
import { addJobs } from "@/lib/actions/jobs";
import JobForm, { JobFormValues } from "@/app/components/jobs/JobForm";



export default function AddJobs() {
  const { data: session, isPending } = useSession();

  const handleCreateJob = async (jobData: JobFormValues) => {
    if (isPending || !session?.user) {
      throw new Error("Please sign in before publishing a job.");
    }

    const result = await addJobs({
      ...jobData,

      // Recruiter information
      createdAt: new Date().toISOString(),
      createdBy: session.user.id,
      createdByName: session.user.name,
      createdByEmail: session.user.email,
    });

    return result;
  };

  return (
    <JobForm
      mode="create"
      onSubmit={handleCreateJob}
    />
  );
}
