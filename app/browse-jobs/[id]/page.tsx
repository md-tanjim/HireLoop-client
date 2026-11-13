
import Link from "next/link";
import { notFound } from "next/navigation";

import { getJobById } from "@/lib/actions/updateJobs";


import {
  ArrowLeft,
  Banknote,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CalendarClock,
  Clock3,
  MapPin,
  Monitor,
  UserRound,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { IJob } from "@/types/job";


// Convert newline-separated text into individual list items.
const getTextItems = (text: string) => {
  return text
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
};

// Format dates.
const formatDate = (dateString: string) => {
  if (!dateString) return "Not specified";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

// Format salary without assuming a currency.
const formatSalary = (job: IJob) => {
  const { minSalary, maxSalary, frequency } = job;

  if (minSalary == null && maxSalary == null) {
    return "Not specified";
  }

  const formatNumber = (value: number) =>
    new Intl.NumberFormat("en-US").format(value);

  let salary = "";

  if (minSalary != null && maxSalary != null) {
    salary = `${formatNumber(minSalary)} – ${formatNumber(maxSalary)}`;
  } else if (minSalary != null) {
    salary = `From ${formatNumber(minSalary)}`;
  } else {
    salary = `Up to ${formatNumber(maxSalary!)}`;
  }

  return `${salary} ${frequency || ""}`.trim();
};

// Reusable component for the information cards.
const InfoCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) => (
  <Card className="border-white/10 bg-[#121318]">
    <CardContent className="flex items-start gap-3 p-4">
      <div className="rounded-lg bg-white/5 p-2 text-muted-foreground">
        <Icon size={18} />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 break-words text-sm font-semibold text-white">
          {value}
        </p>
      </div>
    </CardContent>
  </Card>
);

// Reusable component for sidebar details.
const DetailRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) => (
  <div className="flex items-start justify-between gap-4 py-3">
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Icon size={15} />
      {label}
    </div>

    <p className="text-right text-sm font-medium text-white">{value}</p>
  </div>
);

type DetailedJobProps = {
  params: Promise<{ id: string }>;
};

const DetailedJob = async ({ params }: DetailedJobProps) => {
  const { id } = await params;

  let jobData: IJob;

  try {
    jobData = await getJobById(id);
  } catch (error) {
    console.error("Fetch job error:", error);

    if (
      error instanceof Error &&
      error.message.toLowerCase().includes("not found")
    ) {
      notFound();
    }

    throw error;
  }

  const responsibilities = getTextItems(
    jobData.responsibilities || ""
  );

  const qualifications = getTextItems(
    jobData.qualifications || ""
  );

  const companyInitials = jobData.companyName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const experienceLabel =
    Number.isFinite(jobData.experience) && jobData.experience >= 0
      ? `${jobData.experience} ${jobData.experience === 1 ? "Year" : "Years"}`
      : "Not specified";

  return (
    <main className="min-h-screen bg-[#08090d] px-4 py-8 text-white">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          
          className="w-fit text-muted-foreground hover:text-white"
        >
          <Link href="/jobs">
            <ArrowLeft size={16} />
            Back to Jobs
          </Link>
        </Button>

        {/* Job Header */}
        <Card className="border-white/10 bg-[#121318]">
          <CardContent className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center">

            <Avatar className="h-14 w-14 rounded-xl border border-white/10">
              <AvatarFallback className="rounded-xl bg-[#252536] text-lg font-bold text-white">
                {companyInitials || <Building2 />}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {jobData.title}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium text-white">
                  {jobData.companyName}
                </span>

                <span>•</span>

                <span>{jobData.category}</span>

                <Badge variant="outline" className="border-white/15">
                  {jobData.isRemote ? "Remote" : "On-site"}
                </Badge>
              </div>
            </div>

            <Button  variant="outline" className="shrink-0">
              <Link href="/jobs">Browse Jobs</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(280px,0.95fr)]">

          {/* Left Column */}
          <div className="min-w-0 space-y-5">

            {/* Job Information Cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <InfoCard
                icon={Banknote}
                label="SALARY RANGE"
                value={formatSalary(jobData)}
              />

              <InfoCard
                icon={MapPin}
                label="LOCATION"
                value={jobData.location}
              />

              <InfoCard
                icon={BriefcaseBusiness}
                label="JOB TYPE"
                value={jobData.jobType}
              />

              <InfoCard
                icon={Clock3}
                label="EXPERIENCE"
                value={experienceLabel}
              />
            </div>

            {/* Job Description and Requirements */}
            <Card className="border-white/10 bg-[#121318]">
              <CardContent className="space-y-6 p-5 sm:p-6">

                {/* Role Overview */}
                <section>
                  <h2 className="text-lg font-semibold">
                    Role Overview
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {jobData.companyName} is looking for a{" "}
                    {jobData.title} for a {jobData.jobType.toLowerCase()}{" "}
                    position in {jobData.location}.
                    {jobData.isRemote
                      ? " This position offers remote work."
                      : ""}
                  </p>
                </section>

                <Separator className="bg-white/10" />

                {/* Responsibilities */}
                <section>
                  <h2 className="text-lg font-semibold">
                    Responsibilities
                  </h2>

                  {responsibilities.length > 0 ? (
                    <ul className="mt-4 space-y-3">
                      {responsibilities.map((item, index) => (
                        <li
                          key={index}
                          className="flex gap-3 text-sm leading-6 text-muted-foreground"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-sm text-muted-foreground">
                      No responsibilities provided.
                    </p>
                  )}
                </section>

                <Separator className="bg-white/10" />

                {/* Qualifications */}
                <section>
                  <h2 className="text-lg font-semibold">
                    Requirements & Qualifications
                  </h2>

                  {qualifications.length > 0 ? (
                    <ul className="mt-4 space-y-3">
                      {qualifications.map((item, index) => (
                        <li
                          key={index}
                          className="flex gap-3 text-sm leading-6 text-muted-foreground"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-sm text-muted-foreground">
                      No qualifications provided.
                    </p>
                  )}
                </section>

              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <aside className="space-y-5">

            {/* Company Overview */}
            <Card className="border-white/10 bg-[#121318]">
              <CardHeader>
                <CardTitle className="text-lg">
                  Company Overview
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-[#252536] font-semibold text-white">
                      {companyInitials || <Building2 />}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <h3 className="break-words font-semibold">
                      {jobData.companyName}
                    </h3>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {jobData.category}
                    </p>
                  </div>
                </div>

                <Separator className="my-5 bg-white/10" />

                <div className="divide-y divide-white/10">
                  <DetailRow
                    icon={Monitor}
                    label="Work Mode"
                    value={jobData.isRemote ? "Remote" : "On-site"}
                  />

                  <DetailRow
                    icon={MapPin}
                    label="Location"
                    value={jobData.location}
                  />

                  <DetailRow
                    icon={UserRound}
                    label="Posted By"
                    value={jobData.createdByName || "Not specified"}
                  />

                  <DetailRow
                    icon={CalendarDays}
                    label="Posted On"
                    value={formatDate(jobData.createdAt)}
                  />

                  <DetailRow
                    icon={CalendarClock}
                    label="Deadline"
                    value={formatDate(jobData.deadline)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Job Summary */}
            <Card className="border-white/10 bg-[#121318]">
              <CardHeader>
                <CardTitle className="text-lg">
                  Job Summary
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {jobData.category}
                </Badge>

                <p className="text-sm leading-6 text-muted-foreground">
                  {jobData.title} · {jobData.jobType} · {experienceLabel} experience
                </p>
              </CardContent>
            </Card>

          </aside>
        </div>
      </div>
    </main>
  );
};

export default DetailedJob;
