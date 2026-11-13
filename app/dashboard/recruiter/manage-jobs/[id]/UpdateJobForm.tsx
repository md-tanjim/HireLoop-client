
"use client";


import { updateJobs } from "@/lib/actions/updateJobs";

import JobForm, { JobFormValues } from "@/app/components/jobs/JobForm";
import { IJob } from "@/types/job";


type UpdateJobFormProps = {
  jobId: string;
  initialData: IJob;
};

export default function UpdateJobForm({jobId,initialData}: UpdateJobFormProps) {

  const handleUpdateJob = async (jobData: JobFormValues) => {
    const result = await updateJobs(jobId, jobData);

    return result;
  };

  return (
    <JobForm
      mode="update"
      initialData={initialData}
      onSubmit={handleUpdateJob}
    />
  );
}
