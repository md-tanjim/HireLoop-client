
const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
}

// Save a job
export const saveJob = async (
    seekerId: string,
    jobId: string
) => {
    const res = await fetch(`${apiUrl}/save-job`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ seekerId, jobId }),
    });

    const result = await res.json();

    if (!res.ok) {
        throw new Error(result.message || "Failed to save job.");
    }

    return result;
};

// Get saved jobs
export const getSavedJobs = async (seekerId: string) => {
    const res = await fetch(
        `${apiUrl}/saved-jobs/${seekerId}`,
        { cache: "no-store" }
    );

    const result = await res.json();

    if (!res.ok) {
        throw new Error(result.message || "Failed to fetch saved jobs.");
    }

    return result;
};

// delere a saved job
export const removeSavedJob = async (
    seekerId: string,
    jobId: string
) => {
    const res = await fetch(
        `${apiUrl}/remove-saved-job/${seekerId}/${jobId}`,
        {
            method: "DELETE",
        }
    );

    const result = await res.json();

    if (!res.ok) {
        throw new Error(result.message || "Failed to remove saved job.");
    }

    return result;
};
