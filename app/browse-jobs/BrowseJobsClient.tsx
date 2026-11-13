
"use client";

import { useEffect, useState, useTransition } from "react";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  SlidersHorizontal,
  BriefcaseBusiness,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type {
  JobsResponse,
  BrowseFilters,
  JobSort,
  WorkMode,
  ExperienceRange,
} from "@/types/job";
import JobSearch from "../components/jobs/JobSearch";
import JobFilters from "../components/jobs/JobFilters";
import JobCard from "../components/jobs/JobCard";
import JobPagination from "../components/jobs/JobPagination";

type BrowseJobsClientProps = {
  initialData: JobsResponse;
  initialError: string | null;
};

const validSortOptions: JobSort[] = [
  "recent",
  "oldest",
  "salary-high",
  "salary-low",
];

const initialFilters: BrowseFilters = {
  jobTypes: [],
  categories: [],
  workModes: [],
  experience: [],
  location: "",
};

export default function BrowseJobsClient({initialData,initialError}: BrowseJobsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();

  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") ?? ""
  );

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  
  // Read the current filters from the URL.
  const filters: BrowseFilters = {
    jobTypes: searchParams.getAll("jobType"),

    categories: searchParams.getAll("category"),

    workModes: [
      ...new Set(
        searchParams
          .getAll("isRemote")
          .flatMap((value) => {
            if (value === "true") return ["remote"];
            if (value === "false") return ["onsite"];
            return [];
          })
      ),
    ] as WorkMode[],

    experience: searchParams
      .getAll("experience")
      .filter((value): value is ExperienceRange =>
        ["0", "1-2", "3-5", "6+"].includes(value)
      ),

    location: searchParams.get("location") ?? "",
  };

  const search = searchParams.get("search") ?? "";

  const currentSort = searchParams.get("sort");

  const sort: JobSort = validSortOptions.includes(
    currentSort as JobSort
  )
    ? (currentSort as JobSort)
    : "recent";

  // Keep the input synchronized with browser navigation.
  useEffect(() => {
    // eslint-disable-next-line
    setSearchInput(search);
  }, [search]);

  // Common URL navigation function.
  const navigateWithParams = (params: URLSearchParams,resetPage = true) => {
    if (resetPage) {
      params.delete("page");
    }
    // console.log("params==============", params);

    const queryString = params.toString();
    // console.log("queryString==============", queryString);
    // console.log("pathname==============",pathname );
    const url = queryString
      ? `${pathname}?${queryString}`
      : pathname;

    startTransition(() => {
      router.push(url, { scroll: false });
    });
  };

  // Search submission.
  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    const keyword = searchInput.trim();

    if (keyword) {
      params.set("search", keyword);
    } else {
      params.delete("search");
    }

    navigateWithParams(params);
  };

  // Update filters.
  const handleFiltersChange = (newFilters: BrowseFilters) => {
    // console.log("newFilters==========",newFilters );
    const params = new URLSearchParams(searchParams.toString());

    // Remove the previous filter values.
    const filterKeys = [
      "jobType",
      "category",
      "isRemote",
      "experience",
      "location",
    ];

    filterKeys.forEach((key) => params.delete(key));

    // Add selected job types.
    newFilters.jobTypes.forEach((value) => {
      params.append("jobType", value);
    });

    // Add selected categories.
    newFilters.categories.forEach((value) => {
      params.append("category", value);
    });

    // Add selected work modes.
    newFilters.workModes.forEach((mode) => {
      params.append(
        "isRemote",
        mode === "remote" ? "true" : "false"
      );
    });

    // Add selected experience ranges.
    newFilters.experience.forEach((value) => {
      params.append("experience", value);
    });

    // Add location.
    if (newFilters.location.trim()) {
      params.set("location", newFilters.location.trim());
    }

    navigateWithParams(params);
  };

  // Clear filters but preserve the keyword search.
  const handleClearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    [
      "jobType",
      "category",
      "isRemote",
      "experience",
      "location",
      "page",
    ].forEach((key) => params.delete(key));

    navigateWithParams(params, false);
  };

  // Clear both the search and all filters.
  const handleClearAll = () => {
    const params = new URLSearchParams(searchParams.toString());

    [
      "jobType",
      "category",
      "isRemote",
      "experience",
      "location",
      "search",
      "page",
    ].forEach((key) => params.delete(key));

    setSearchInput("");

    navigateWithParams(params, false);
  };

  // Update sorting.
  const handleSortChange = (value: JobSort) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("sort", value);

    navigateWithParams(params);
  };

  // Update pagination.
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", String(page));

    // console.log("-=-=-=======",params.toString());

    navigateWithParams(params, false);
  };

  return (
    <main className="min-h-screen bg-[#08090d] px-4 py-8 text-white">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Search */}
        <JobSearch
          value={searchInput}
          onChange={setSearchInput}
          onSearch={handleSearch}
        />

        {/* Mobile filter button */}
        <div className="lg:hidden">
          <Button
            variant="outline"
            className="w-full border-white/10 bg-[#121318]"
            onClick={() =>
              setShowMobileFilters((previous) => !previous)
            }
          >
            <SlidersHorizontal size={16} />

            {showMobileFilters
              ? "Hide Filters"
              : "Show Filters"}
          </Button>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">

          {/* Sidebar */}
          <aside
            className={
              showMobileFilters
                ? "block lg:block"
                : "hidden lg:block"
            }
          >
            <div className="lg:sticky lg:top-6">
              <JobFilters
                filters={filters}
                onChange={handleFiltersChange}
                onClear={handleClearFilters}
              />
            </div>
          </aside>

          {/* Results */}
          <section className="min-w-0 space-y-5">

            {/* Heading and sorting */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h1 className="text-xl font-semibold">
                  Found {initialData.totalJobs.toLocaleString()} Professional Jobs
                </h1>

                <p className="mt-1 text-xs text-muted-foreground">
                  Explore opportunities that match your preferences.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="shrink-0 text-xs text-muted-foreground">
                  Sort by:
                </span>

                <Select
                  value={sort}
                  onValueChange={(value) =>
                    handleSortChange(value as JobSort)
                  }
                >
                  <SelectTrigger className="w-[155px] border-white/10 bg-[#121318] text-white">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="recent">
                      Most Recent
                    </SelectItem>

                    <SelectItem value="oldest">
                      Oldest
                    </SelectItem>

                    <SelectItem value="salary-high">
                      Highest Salary
                    </SelectItem>

                    <SelectItem value="salary-low">
                      Lowest Salary
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Loading state during URL navigation */}
            {isPending && (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Card
                    key={index}
                    className="border-white/10 bg-[#121318]"
                  >
                    <CardContent className="flex gap-4 p-5">
                      <Skeleton className="h-12 w-12 shrink-0 rounded-lg bg-white/10" />

                      <div className="flex-1 space-y-3">
                        <Skeleton className="h-5 w-1/2 bg-white/10" />
                        <Skeleton className="h-4 w-1/3 bg-white/10" />
                        <Skeleton className="h-5 w-2/3 bg-white/10" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Error state */}
            {!isPending && initialError && (
              <Card className="border-red-500/20 bg-[#121318]">
                <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
                  <p className="font-medium">
                    Unable to load jobs
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {initialError}
                  </p>

                  <Button
                    variant="outline"
                    onClick={() => router.refresh()}
                  >
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Job cards */}
            {!isPending &&
              !initialError &&
              initialData.jobs.length > 0 && (
                <div className="space-y-3">
                  {initialData.jobs.map((job) => (
                    <JobCard 
                    key={typeof job._id === "string" ? job._id : job._id.$oid}
                    job={job}
                    />
                  ))}
                </div>
              )}

            {/* Empty state */}
            {!isPending &&
              !initialError &&
              initialData.jobs.length === 0 && (
                <Card className="border-white/10 bg-[#121318]">
                  <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
                    <div className="rounded-full bg-white/5 p-4">
                      <BriefcaseBusiness
                        size={28}
                        className="text-muted-foreground"
                      />
                    </div>

                    <h2 className="text-lg font-semibold">
                      No Jobs Found
                    </h2>

                    <p className="max-w-sm text-sm text-muted-foreground">
                      We couldnt find any jobs matching your
                      search and filters. Try changing your
                      search criteria.
                    </p>

                    <Button
                      variant="outline"
                      onClick={handleClearAll}
                    >
                      Clear All Filters
                    </Button>
                  </CardContent>
                </Card>
              )}

            {/* Pagination */}
            {!isPending &&
              !initialError &&
              initialData.jobs.length > 0 && (
                <JobPagination
                  currentPage={initialData.currentPage}
                  totalPages={initialData.totalPages}
                  onPageChange={handlePageChange}
                />
              )}

          </section>
        </div>
      </div>
    </main>
  );
}
