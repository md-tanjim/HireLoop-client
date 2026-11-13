
export type JobData = {
    title: string;
    companyName: string;
    category: string;
    jobType: string;
    isRemote: boolean;
    location: string;
    deadline: string;
    minSalary: number | null;
    maxSalary: number | null;
    frequency: string;
    responsibilities: string;
    qualifications: string;
    createdAt: string;
    createdBy?: string;
    createdByName?: string;
    createdByEmail?: string;
};

type AddJobResponse = {
    message?: string;
    [key: string]: unknown;
};


// add job function
export const addJobs = async (jobData: JobData) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

    if (!apiUrl) {
        throw new Error("API URL is not configured.");
    }

    const res = await fetch(`${apiUrl}/add-jobs`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(jobData),
    });

    const result = (await res.json().catch(() => null)) as
        | AddJobResponse
        | null;

    if (!res.ok) {
        throw new Error(
            result?.message || "Failed to publish the job."
        );
    }

    return result;
};

//delete job function
export const deleteJobById = async (jobId: string) => {
        
    
        const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
    
        if (!apiUrl) {
          throw new Error("API URL is not configured.");
        }
          const res = await fetch(
            `${apiUrl}/delete-job/${encodeURIComponent(jobId)}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
    
          const result = await res.json().catch(() => null);
    
          if (!res.ok) {
            throw new Error(
              result?.message || "Failed to delete job."
            );
          }
    
         return result;
        
      };