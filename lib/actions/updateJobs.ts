import { JobFormValues } from "@/app/components/jobs/JobForm";
import { IJob } from "@/types/job";




const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

const getErrorMessage = (result: { message?: string; error?: string } | null, fallback: string) => {
  return result?.message || result?.error || fallback;
};




// Fetch a single job by ID
export const getJobById = async (id: string): Promise<IJob> => {
  if (!API_URL) {
    throw new Error("API URL is not configured.");
  }

  const res = await fetch(
    `${API_URL}/job/${encodeURIComponent(id)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  const result = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      getErrorMessage(result, "Unable to fetch job.")
    );
  }

  return result as IJob;
};



// Update an existing job
export const updateJobs = async (
  id: string,
  jobData: JobFormValues
) => {
  if (!API_URL) {
    throw new Error("API URL is not configured.");
  }

  const res = await fetch(
    `${API_URL}/update-jobs/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobData),
    }
  );

  const result = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      getErrorMessage(result, "Failed to update job.")
    );
  }

  return result as { message?: string };
};
