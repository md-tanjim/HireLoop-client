






export const getRecruiterJobs = async (email: string): Promise<IJob[]> => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

    if (!apiUrl) {
        throw new Error("API URL is not configured.");
    }

    const res = await fetch(
        `${apiUrl}/jobs/${encodeURIComponent(email)}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
        }
    );

    if (!res.ok) {
        throw new Error("Unable to fetch job listings.");
    }

    const data = await res.json();

    // Supports either an array or an object containing a jobs array
    const jobsData = Array.isArray(data) ? data : data?.jobs;

    if (!Array.isArray(jobsData)) {
        throw new Error("Invalid jobs response from server.");
    }

    return jobsData as IJob[];
};

// export const getALLJobs = async (query = '') =>{
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/all-jobs?${query}`, {
//         method: "GET",
//     });

//     if (!res.ok) {
//         throw new Error("Unable to fetch all job listings.");
//     }

//     const data = await res.json();

//     return data as IJob[];

// }



import "server-only";
import { IJob, JobsResponse } from "@/types/job";

export async function getAllJobs(params: URLSearchParams): Promise<JobsResponse> {

    const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

    if (!API_URL) {
        throw new Error("NEXT_PUBLIC_API_URL is not configured");
    }

    const queryString = params.toString();

    const response = await fetch(`${API_URL}/all-jobs?${queryString}`,
        {
            cache: "no-store",
        }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.error || "Failed to fetch jobs"
        );
    }

    return data as JobsResponse;
}
