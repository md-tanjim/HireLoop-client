

import { getAllJobs } from "@/lib/api/jobs";
import { JobsResponse } from "@/types/job";
import BrowseJobsClient from "./BrowseJobsClient";


type JobsPageProps = {
  searchParams: Promise<{[key: string]: string | string[] | undefined;}>;
};

const JOBS_PER_PAGE = 8;

const validSortOptions = [
  "recent",
  "oldest",
  "salary-high",
  "salary-low",
] as const;

//main component func
export default async function JobsPage({searchParams}: JobsPageProps) {
  
    const search = await searchParams;

  const params = new URLSearchParams();

  // These parameters can have multiple values.
  const multiValueKeys = [
    "jobType",
    "category",
    "isRemote",
    "experience",
  ];

  // Preserve all selected values.
  for (const key of multiValueKeys) {
    const value = search[key];

    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, item));
    } else if (typeof value === "string") {
      params.append(key, value);
    }
  }

  // These parameters should have only one value.
  const getSingleValue = (key: string) => {
    const value = search[key];

    if (Array.isArray(value)) {
      return value[0];
    }

    return value;
  };

  const searchKeyword = getSingleValue("search")?.trim();
  const location = getSingleValue("location")?.trim();

  if (searchKeyword) {
    params.set("search", searchKeyword);
  }

  if (location) {
    params.set("location", location);
  }

  // Validate the page number.
  const requestedPage = Number(getSingleValue("page") ?? "1");

  const page =
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  // Validate the sorting option.
  const requestedSort = getSingleValue("sort");

  const sort = 
  validSortOptions.includes(requestedSort as (typeof validSortOptions)[number])
    ? requestedSort!
    : "recent";

  // Pagination settings.
  params.set("page", String(page));
  params.set("limit", String(JOBS_PER_PAGE));
  params.set("sort", sort);

  // Fetch initial jobs on the server.
  const emptyResponse: JobsResponse = {
    jobs: [],
    totalJobs: 0,
    currentPage: page,
    totalPages: 0,
  };

  let initialData = emptyResponse;
  let error: string | null = null;

  try {
    initialData = await getAllJobs(params);
  } catch (err) {
    console.error("Browse jobs fetch error:", err);

    error =
      err instanceof Error
        ? err.message
        : "Unable to fetch jobs.";
  }

  return (
    <BrowseJobsClient
      initialData={initialData}
      initialError={error}
    />
  );
}
