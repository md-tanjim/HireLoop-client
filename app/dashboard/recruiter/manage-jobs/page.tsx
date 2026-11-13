
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
    Plus,
    BriefcaseBusiness,
    RefreshCw,
    Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
} from "@/components/ui/card";

import {
    Table,
    TableHeader,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import ManageJobsCard from "./ManageJobsCard";
import { IJob } from "@/types/job";
import { getRecruiterJobs } from "@/lib/api/jobs";


// Job type based on your MongoDB document


// async function getRecruiterJobs(email: string): Promise<Job[]> {
//     const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

//     if (!apiUrl) {
//         throw new Error("API URL is not configured.");
//     }

//     const res = await fetch(
//         `${apiUrl}/jobs/${encodeURIComponent(email)}`,
//         {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             cache: "no-store",
//         }
//     );

//     if (!res.ok) {
//         throw new Error("Unable to fetch job listings.");
//     }

//     const data = await res.json();

//     // Supports either an array or an object containing a jobs array
//     const jobsData = Array.isArray(data) ? data : data?.jobs;

//     if (!Array.isArray(jobsData)) {
//         throw new Error("Invalid jobs response from server.");
//     }

//     return jobsData as Job[];
// }

const ManageJobs = async () => {

    // Get authenticated session
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    // Check authentication
    if (!session) {
        redirect("/signin?callbackUrl=/dashboard/recruiter/manage-jobs");
    }

    // Check recruiter role
    if (session.user.role !== "recruiter") {
        redirect("/dashboard");
    }

    // Fetch recruiter jobs
    let jobs: IJob[] = [];
    let fetchError = "";

    try {
        jobs = await getRecruiterJobs(session.user.email);
    } catch (error) {
        console.error("Manage jobs fetch error:", error);

        fetchError =
            error instanceof Error
                ? error.message
                : "Something went wrong.";
    }

    return (
        <main className="min-h-screen w-full bg-[#111112] px-4 py-6 text-white sm:px-6 lg:px-8">

            <div className="mx-auto w-full max-w-[1450px]">

                {/* Page Header */}
                <div className="mb-7 flex flex-col justify-between gap-5 border-b border-white/[0.06] pb-6 sm:flex-row sm:items-center">

                    <div>

                        {/* Breadcrumb */}
                        <div className="mb-2 flex items-center gap-2 text-xs text-[#92929c]">
                            <span>Manage Jobs</span>
                            <span>/</span>
                            <span className="text-[#c3bcff]">
                                Job Listings & Postings
                            </span>
                        </div>

                        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                            Manage Job Posts
                        </h1>

                        <p className="mt-1 max-w-2xl text-sm text-[#92929c]">
                            Review live listings, monitor applicants, and update job
                            details across your organization.
                        </p>

                    </div>

                    {/* New Job Button */}
                    <Button
                        render={
                            <Link href="/dashboard/recruiter/add-jobs" />
                        }
                        className="h-10 shrink-0 rounded-lg bg-[#5b52f4] px-5 text-sm font-semibold text-white shadow-lg shadow-[#5b52f4]/20 hover:bg-[#6b63ff]"
                    >
                        <Plus className="mr-1 size-4" />
                        New Job Post
                    </Button>

                </div>

                {/* Listing Summary */}
                <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">

                    <Card className="border-[#242429] bg-[#151517] shadow-none">
                        <CardContent className="flex items-center gap-3 p-4">

                            <div className="flex size-10 items-center justify-center rounded-lg bg-[#5b52f4]/15">
                                <BriefcaseBusiness className="size-5 text-[#9690ff]" />
                            </div>

                            <div>
                                <p className="text-xs text-[#92929c]">
                                    Total Job Listings
                                </p>

                                <p className="mt-0.5 text-xl font-semibold text-white">
                                    {jobs.length}
                                </p>
                            </div>

                        </CardContent>
                    </Card>

                    <Card className="border-[#242429] bg-[#151517] shadow-none">
                        <CardContent className="flex items-center gap-3 p-4">

                            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
                                <RefreshCw className="size-5 text-emerald-400" />
                            </div>

                            <div>
                                <p className="text-xs text-[#92929c]">
                                    Listings Retrieved
                                </p>

                                <p className="mt-0.5 text-xl font-semibold text-white">
                                    {fetchError ? "Failed" : "Updated"}
                                </p>
                            </div>

                        </CardContent>
                    </Card>

                </div>

                {/* Jobs Table Container */}
                <Card className="overflow-hidden border-[#25252b] bg-[#151517] shadow-none">

                    {/* Table Header */}
                    <div className="flex flex-col justify-between gap-3 border-b border-[#25252b] p-4 sm:flex-row sm:items-center">

                        <div>
                            <h2 className="text-sm font-semibold text-white">
                                Your Job Listings
                            </h2>

                            <p className="mt-1 text-xs text-[#858590]">
                                {jobs.length} listings found
                            </p>
                        </div>

                        {/* Search - UI for the next stage */}
                        <div className="relative w-full sm:max-w-[250px]">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#777780]" />

                            <input
                                type="search"
                                placeholder="Search job listings..."
                                disabled
                                className="h-9 w-full rounded-lg border border-[#29292f] bg-[#202023] pl-9 pr-3 text-xs text-white outline-none placeholder:text-[#777780] disabled:cursor-not-allowed disabled:opacity-60"
                            />
                        </div>

                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">

                        <Table>

                            <TableHeader className="bg-[#101012]">
                                <TableRow className="border-[#25252b] hover:bg-transparent">

                                    <TableHead className="min-w-[220px] text-[11px] font-semibold uppercase tracking-wide text-[#a1a1ad]">
                                        Job Title & Dept
                                    </TableHead>

                                    <TableHead className="min-w-[200px] text-[11px] font-semibold uppercase tracking-wide text-[#a1a1ad]">
                                        Company & Location
                                    </TableHead>

                                    <TableHead className="min-w-[100px] text-[11px] font-semibold uppercase tracking-wide text-[#a1a1ad]">
                                        Type
                                    </TableHead>

                                    <TableHead className="min-w-[145px] text-[11px] font-semibold uppercase tracking-wide text-[#a1a1ad]">
                                        Compensation
                                    </TableHead>

                                    <TableHead className="min-w-[130px] text-[11px] font-semibold uppercase tracking-wide text-[#a1a1ad]">
                                        Applicants
                                    </TableHead>

                                    <TableHead className="min-w-[100px] text-[11px] font-semibold uppercase tracking-wide text-[#a1a1ad]">
                                        Status
                                    </TableHead>

                                    <TableHead className="min-w-[130px] text-[11px] font-semibold uppercase tracking-wide text-[#a1a1ad]">
                                        Deadline
                                    </TableHead>

                                    <TableHead className="min-w-[140px] text-right text-[11px] font-semibold uppercase tracking-wide text-[#a1a1ad]">
                                        Actions
                                    </TableHead>

                                </TableRow>
                            </TableHeader>

                            <TableBody>

                                {fetchError ? (
                                    <TableRow className="border-[#25252b] hover:bg-transparent">
                                        <TableCell colSpan={8} className="h-40 text-center">

                                            <div className="flex flex-col items-center gap-2">
                                                <p className="text-sm font-medium text-red-400">
                                                    Failed to load job listings
                                                </p>

                                                <p className="text-xs text-[#92929c]">
                                                    {fetchError}
                                                </p>
                                            </div>

                                        </TableCell>
                                    </TableRow>

                                ) : jobs.length === 0 ?
                                    (
                                        <TableRow className="border-[#25252b] hover:bg-transparent">
                                            <TableCell colSpan={8} className="h-48 text-center">

                                                <div className="flex flex-col items-center gap-3">

                                                    <div className="flex size-12 items-center justify-center rounded-xl bg-white/5">
                                                        <BriefcaseBusiness className="size-6 text-[#777780]" />
                                                    </div>

                                                    <div>
                                                        <p className="text-sm font-medium text-white">
                                                            No job posts yet
                                                        </p>

                                                        <p className="mt-1 text-xs text-[#858590]">
                                                            Start attracting talent by publishing your first job.
                                                        </p>
                                                    </div>

                                                    <Button
                                                        render={
                                                            <Link href="/dashboard/recruiter/add-jobs" />
                                                        }
                                                        size="sm"
                                                        className="mt-1 bg-[#5b52f4] text-white hover:bg-[#6b63ff]"
                                                    >
                                                        <Plus className="mr-1 size-4" />
                                                        Create Job Post
                                                    </Button>

                                                </div>

                                            </TableCell>
                                        </TableRow>

                                    ) :
                                    (
                                        jobs.map((jobData, index) => (
                                            <ManageJobsCard
                                                key={
                                                    typeof jobData._id === "string"
                                                        ? jobData._id
                                                        : jobData._id.$oid
                                                }
                                                jobData={jobData}
                                                applicantCount={[34, 19, 12, 27, 8][index % 5]}
                                            />
                                        ))
                                    )
                                }

                            </TableBody>

                        </Table>

                    </div>
                </Card>

            </div>
        </main>
    );
};

export default ManageJobs;
