
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import {
  Banknote,
  MapPin,
  BriefcaseBusiness,
  Clock3,
} from "lucide-react";
import { IJob } from "@/types/job";



type JobCardProps = {
  job: IJob;
};

function getJobId(job: IJob) {
  return typeof job._id === "string"
    ? job._id
    : job._id.$oid;
}

function getCompanyInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatSalary(job: IJob) {
  const { minSalary, maxSalary, frequency } = job;

  if (minSalary == null && maxSalary == null) {
    return "Salary not specified";
  }

  const formatNumber = (value: number) =>
    new Intl.NumberFormat("en-US").format(value);

  let salary = "";

  if (minSalary != null && maxSalary != null) {
    salary = `${formatNumber(minSalary)} - ${formatNumber(maxSalary)}`;
  } else if (minSalary != null) {
    salary = `From ${formatNumber(minSalary)}`;
  } else {
    salary = `Up to ${formatNumber(maxSalary!)}`;
  }

  return `${salary} ${frequency || ""}`.trim();
}

export default function JobCard({ job }: JobCardProps) {
  const jobId = getJobId(job);

  const experience =
    job.experience === 0
      ? "No experience"
      : `${job.experience}+ Years`;

  return (
    <Link  href={`/browse-jobs/${jobId}`} className="block">
      <Card className="border-white/10 bg-[#121318] transition-colors hover:border-primary/50 hover:bg-[#16171d]">
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:p-5">

          {/* Company initials */}
          <Avatar className="h-12 w-12 shrink-0 rounded-lg border border-white/10">
            <AvatarFallback className="rounded-lg bg-[#252536] font-semibold text-white">
              {getCompanyInitials(job.companyName)}
            </AvatarFallback>
          </Avatar>

          {/* Job information */}
          <div className="min-w-0 flex-1">

            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-white sm:text-lg">
                {job.title}
              </h3>

              <Badge
                variant="outline"
                className="border-white/10 text-xs text-muted-foreground"
              >
                {job.category}
              </Badge>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
              <span className="font-medium text-white/80">
                {job.companyName}
              </span>

              <span>•</span>

              <span className="flex items-center gap-1">
                <MapPin size={13} />
                {job.location}
              </span>
            </div>

            {/* Job details */}
            <div className="mt-4 flex flex-wrap gap-2">

              <Badge
                variant="outline"
                className="gap-1.5 border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs font-normal text-muted-foreground"
              >
                <Banknote size={13} />
                {formatSalary(job)}
              </Badge>

              <Badge
                variant="outline"
                className="gap-1.5 border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs font-normal text-muted-foreground"
              >
                <BriefcaseBusiness size={13} />
                {job.jobType}
              </Badge>

              <Badge
                variant="outline"
                className="gap-1.5 border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs font-normal text-muted-foreground"
              >
                <Clock3 size={13} />
                {experience}
              </Badge>

              <Badge
                variant="outline"
                className="border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs font-normal text-muted-foreground"
              >
                {job.isRemote ? "Remote" : "On-site"}
              </Badge>

            </div>
          </div>

        </CardContent>
      </Card>
    </Link>
  );
}
