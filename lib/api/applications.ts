import { JobWithCandidates } from "@/types/job";
import { number } from "better-auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ApplyForJobParams = {
  jobId: string;
  seekerId: string;
  resumeUrl: string;
};

type ApplicationResponse = {
  success: boolean;
  message: string;
  applicationId?: string;
};

export const applyForJob = async ({jobId,seekerId,resumeUrl}: ApplyForJobParams): Promise<ApplicationResponse> => {
  
    try {
    const response = await fetch(`${API_URL}/add-applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({jobId,seekerId,resumeUrl}),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to submit application.");
    }

    return data;

  } catch (error) {
    console.error("Apply for job error:", error);

    throw error;
  }
};





//count applications
export const countApplications = async(query = "") : Promise<{count : number}>  =>{
    const res= await fetch(`${API_URL}/applications/count?${query}`);

    return res.json();
};




//get all applicants info and job info
export const getApplicantsDetails = async (jobId: string): Promise<JobWithCandidates | null> => {

  const response = await fetch(
    `${API_URL}/candidates/${encodeURIComponent(jobId)}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch candidates: ${response.status}`
    );
  }
  return response.json();
};
