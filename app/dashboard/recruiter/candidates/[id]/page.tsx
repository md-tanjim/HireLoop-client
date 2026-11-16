
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileText,
  MapPin,
  Users,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { ApplicationStatus, Candidate } from "@/types/job";
import { getApplicantsDetails } from "@/lib/api/applications";


type CandidatesPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const statusStyles: Record<
  ApplicationStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  },
  reviewing: {
    label: "Reviewing",
    className: "border-blue-500/20 bg-blue-500/10 text-blue-400",
  },
  shortlisted: {
    label: "Shortlisted",
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  },
  rejected: {
    label: "Rejected",
    className: "border-red-500/20 bg-red-500/10 text-red-400",
  },
  hired: {
    label: "Hired",
    className: "border-violet-500/20 bg-violet-500/10 text-violet-400",
  },
  withdrawn: {
    label: "Withdrawn",
    className: "border-gray-500/20 bg-gray-500/10 text-gray-400",
  },
};

function formatDate(date: string) {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsedDate);
}

function CandidateCard({
  candidate,
}: {
  candidate: Candidate;
}) {
  const status = statusStyles[candidate.status];

  return (
    <article className="rounded-2xl border border-white/10 bg-[#11131F] p-5 transition hover:border-violet-500/30">
      {/* Candidate header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-lg font-semibold text-violet-300">
            {candidate.applicant.name?.charAt(0).toUpperCase() || "?"}
          </div>

          <div className="min-w-0">
            <h3 className="truncate font-semibold text-white">
              {candidate.applicant.name}
            </h3>

            <p className="mt-1 break-all text-sm text-gray-400">
              {candidate.applicant.email}
            </p>
          </div>
        </div>

        <span
          className={`w-fit shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      {/* Application information */}
      <div className="my-5 grid gap-4 border-y border-white/10 py-4 sm:grid-cols-2">
        <div className="flex items-center gap-2.5">
          <CalendarDays size={16} className="shrink-0 text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Applied on</p>
            <p className="mt-1 text-sm text-gray-300">
              {formatDate(candidate.appliedAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Clock3 size={16} className="shrink-0 text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Last updated</p>
            <p className="mt-1 text-sm text-gray-300">
              {formatDate(candidate.updatedAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Recruiter note */}
      {candidate.recruiterNote && (
        <div className="mb-5 rounded-lg bg-white/[0.03] p-3">
          <p className="mb-1 text-xs font-medium text-gray-400">
            Recruiter note
          </p>
          <p className="text-sm leading-6 text-gray-300">
            {candidate.recruiterNote}
          </p>
        </div>
      )}

      {/* Resume */}
      {candidate.resumeUrl ? (
        <a
          href={candidate.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-violet-500/20 bg-violet-500/10 px-4 py-2.5 text-sm font-medium text-violet-300 transition hover:bg-violet-500/20"
        >
          <FileText size={16} />
          View Resume
          <ExternalLink size={14} />
        </a>
      ) : (
        <div className="rounded-lg border border-white/10 px-4 py-2.5 text-center text-sm text-gray-500">
          No resume provided
        </div>
      )}
    </article>
  );
}

export default async function CandidatesDetails({
  params,
}: CandidatesPageProps) {
  const { id } = await params;

  // 1. Check the authenticated user
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin");
  }

  if (session.user.accountType !== "recruiter") {
    redirect("/dashboard");
  }

  // 2. Fetch job and candidate information
  const data = await getApplicantsDetails(id);

  if (!data) {
    notFound();
  }

  // 3. Make sure this job belongs to the current recruiter
  if (data.createdByEmail !== session.user.email) {
    notFound();
  }

  // 4. Prepare candidate data
  const candidates = [...(data.candidates ?? [])].sort(
    (a, b) =>
      new Date(b.appliedAt).getTime() -
      new Date(a.appliedAt).getTime()
  );

  const totalCandidates = candidates.length;

  const pendingCount = candidates.filter(
    (candidate) => candidate.status === "pending"
  ).length;

  const reviewingCount = candidates.filter(
    (candidate) => candidate.status === "reviewing"
  ).length;

  const shortlistedCount = candidates.filter(
    (candidate) => candidate.status === "shortlisted"
  ).length;

  const salaryRange =
    data.minSalary != null && data.maxSalary != null
      ? `${data.minSalary.toLocaleString()} – ${data.maxSalary.toLocaleString()} ${data.frequency}`
      : "Not specified";

  return (
    <main className="min-h-screen bg-[#080A12] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Back navigation */}
        <Link
          href="/dashboard/recruiter/manage-jobs"
          className="mb-7 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Manage Jobs
        </Link>

        {/* Page heading */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-sm text-violet-400">
            <Users size={17} />
            Recruitment management
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Candidates
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Review and manage applications submitted for this job.
          </p>
        </div>

        {/* Job information */}
        <section className="mb-7 rounded-2xl border border-white/10 bg-[#11131F] p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
                {data.category}
              </span>

              <h2 className="mt-4 text-xl font-semibold">
                {data.title}
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                {data.companyName}
              </p>
            </div>

            <span className="w-fit rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-gray-300">
              {data.jobType}
            </span>
          </div>

          <div className="mt-6 grid gap-4 border-t border-white/10 pt-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <MapPin size={16} className="text-gray-500" />
              <span>{data.location}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-400">
              <BriefcaseBusiness size={16} className="text-gray-500" />
              <span>
                {data.isRemote ? "Remote" : "On-site"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-400">
              <CalendarDays size={16} className="text-gray-500" />
              <span>Deadline: {data.deadline}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-400">
              <CheckCircle2 size={16} className="text-gray-500" />
              <span>{salaryRange}</span>
            </div>
          </div>
        </section>

        {/* Candidate statistics */}
        <section className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            {
              label: "Total applicants",
              count: totalCandidates,
              icon: Users,
              color: "text-violet-400",
              bg: "bg-violet-500/10",
            },
            {
              label: "Pending",
              count: pendingCount,
              icon: Clock3,
              color: "text-amber-400",
              bg: "bg-amber-500/10",
            },
            {
              label: "Reviewing",
              count: reviewingCount,
              icon: FileText,
              color: "text-blue-400",
              bg: "bg-blue-500/10",
            },
            {
              label: "Shortlisted",
              count: shortlistedCount,
              icon: CheckCircle2,
              color: "text-emerald-400",
              bg: "bg-emerald-500/10",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-xl border border-white/10 bg-[#11131F] p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-gray-400">
                    {item.label}
                  </span>

                  <span className={`rounded-lg p-2 ${item.bg} ${item.color}`}>
                    <Icon size={17} />
                  </span>
                </div>

                <p className="mt-3 text-2xl font-bold">
                  {item.count}
                </p>
              </div>
            );
          })}
        </section>

        {/* Candidates list */}
        <section>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">
                All applicants
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                {totalCandidates}{" "}
                {totalCandidates === 1 ? "application" : "applications"}{" "}
                received
              </p>
            </div>
          </div>

          {candidates.length > 0 ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {candidates.map((candidate) => (
                <CandidateCard
                  key={candidate._id}
                  candidate={candidate}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 bg-[#11131F]/50 px-5 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-gray-500">
                <Users size={25} />
              </div>

              <h3 className="mt-5 font-semibold">
                No applications yet
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                You havent received any applications for this position.
                Candidates will appear here when they apply.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
