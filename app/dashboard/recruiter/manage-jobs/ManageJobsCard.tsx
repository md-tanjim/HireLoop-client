
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import {
  Globe2,
  MapPin,
  Users,
  Pencil,
  Trash2,
} from "lucide-react";


import { categoryIcons } from "@/lib/jobCategories";

import { Button } from "@/components/ui/button";
import {
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { IJob } from "@/types.ts/job";


type ManageJobsCardProps = {jobData: IJob;applicantCount: number;};

// Category colors
const categoryColors: Record<
  string,
  { icon: string; text: string; background: string }
> = {
  "Engineering & Tech": {
    icon: "text-blue-400",
    text: "text-blue-400",
    background: "bg-blue-500/10",
  },
  "Design & Creative": {
    icon: "text-orange-400",
    text: "text-orange-400",
    background: "bg-orange-500/10",
  },
  Marketing: {
    icon: "text-purple-400",
    text: "text-purple-400",
    background: "bg-purple-500/10",
  },
  Sales: {
    icon: "text-emerald-400",
    text: "text-emerald-400",
    background: "bg-emerald-500/10",
  },
  "Finance & Accounting": {
    icon: "text-green-400",
    text: "text-green-400",
    background: "bg-green-500/10",
  },
  "Human Resources": {
    icon: "text-pink-400",
    text: "text-pink-400",
    background: "bg-pink-500/10",
  },
  "Customer Support": {
    icon: "text-cyan-400",
    text: "text-cyan-400",
    background: "bg-cyan-500/10",
  },
  "Business & Management": {
    icon: "text-indigo-400",
    text: "text-indigo-400",
    background: "bg-indigo-500/10",
  },
  Education: {
    icon: "text-yellow-400",
    text: "text-yellow-400",
    background: "bg-yellow-500/10",
  },
  Healthcare: {
    icon: "text-rose-400",
    text: "text-rose-400",
    background: "bg-rose-500/10",
  },
  Other: {
    icon: "text-gray-400",
    text: "text-gray-400",
    background: "bg-gray-500/10",
  },
};

// Get MongoDB ID
const getJobId = (job: IJob): string => {
  return typeof job._id === "string"
    ? job._id
    : job._id.$oid;
};

// Format salary
const formatSalary = (job: IJob) => {
  const { minSalary, maxSalary, frequency } = job;

  if (minSalary == null && maxSalary == null) {
    return "Negotiable";
  }

  const period = frequency?.replace(/^per\s*/i, "") || "";

  if (minSalary != null && maxSalary != null) {
    return `${minSalary.toLocaleString()} – ${maxSalary.toLocaleString()} / ${period}`;
  }

  if (minSalary != null) {
    return `From ${minSalary.toLocaleString()} / ${period}`;
  }

  return `Up to ${maxSalary!.toLocaleString()} / ${period}`;
};

// Format deadline
const formatDeadline = (deadline: string) => {
  if (!deadline) return "Not specified";

  const date = new Date(`${deadline.slice(0, 10)}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
};

// Check whether a job is active or expired
const getJobStatus = (deadline: string) => {
  if (!deadline) return "Unknown";

  const date = new Date(`${deadline.slice(0, 10)}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "Unknown";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date >= today ? "Active" : "Expired";
};

// Calculate time since posting
const getPostedTime = (createdAt: string) => {
  if (!createdAt) return "Date unavailable";

  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  const diff = Date.now() - date.getTime();

  if (diff < 0) return "Posted today";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Posted today";
  if (days === 1) return "Posted 1d ago";
  if (days < 7) return `Posted ${days}d ago`;

  const weeks = Math.floor(days / 7);

  if (weeks === 1) return "Posted 1w ago";
  if (days < 30) return `Posted ${weeks}w ago`;

  const months = Math.floor(days / 30);

  if (months === 1) return "Posted 1mo ago";
  if (days < 365) return `Posted ${months}mo ago`;

  const years = Math.floor(days / 365);

  return `Posted ${years}y ago`;
};

//main component
export default function ManageJobsCard({jobData,applicantCount}: ManageJobsCardProps) {

  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const jobId = getJobId(jobData);

  const Icon =
    categoryIcons[jobData.category as keyof typeof categoryIcons];

  const colors = categoryColors[jobData.category] ?? categoryColors.Other;

  const status = getJobStatus(jobData.deadline);

  // Delete job
  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${jobData.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

    if (!apiUrl) {
      toast.error("API URL is not configured.");
      return;
    }

    setDeleting(true);

    try {
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

      toast.success(result?.message || "Job deleted successfully!");

      // Refresh server-rendered job listings
      router.refresh();

    } catch (error) {
      console.error("Delete job error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <TableRow className="border-[#25252b] transition-colors hover:bg-white/[0.025]">

      {/* Job Title & Category */}
      <TableCell className="py-4">
        <div className="flex min-w-[220px] items-center gap-3">

          <div
            className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${colors.background}`}
          >
            {Icon ? (
              <Icon className={`size-5 ${colors.icon}`} />
            ) : (
              <Users className={`size-5 ${colors.icon}`} />
            )}
          </div>

          <div className="min-w-0">
            <p className="max-w-[190px] truncate text-sm font-semibold text-white">
              {jobData.title}
            </p>

            <p className={`mt-1 text-xs ${colors.text}`}>
              {jobData.category}
            </p>
          </div>

        </div>
      </TableCell>

      {/* Company & Location */}
      <TableCell className="py-4">
        <div className="min-w-[180px]">

          <p className="max-w-[190px] truncate text-sm font-medium text-white">
            {jobData.companyName}
          </p>

          <div className="mt-1 flex items-center gap-1.5 text-xs text-[#92929c]">

            {jobData.isRemote ? (
              <Globe2 className="size-4 shrink-0" />
            ) : (
              <MapPin className="size-4 shrink-0" />
            )}

            <span className="max-w-[180px] truncate">
              {jobData.isRemote
                ? `Remote (${jobData.location})`
                : jobData.location}
            </span>

          </div>
        </div>
      </TableCell>

      {/* Job Type */}
      <TableCell className="py-4">
        <span className="whitespace-nowrap rounded-full bg-[#252529] px-3 py-1.5 text-[11px] font-medium text-[#dedee4]">
          {jobData.jobType}
        </span>
      </TableCell>

      {/* Compensation */}
      <TableCell className="py-4">
        <span className="whitespace-nowrap text-xs font-medium text-white">
          {formatSalary(jobData)}
        </span>
      </TableCell>

      {/* Applicants - hardcoded for now */}
      <TableCell className="py-4">
        <div className="flex min-w-[120px] items-center gap-1.5 whitespace-nowrap text-xs font-medium text-[#bcb6ff]">
          <Users className="size-5 shrink-0" />
          {applicantCount} Candidates
        </div>
      </TableCell>

      {/* Status */}
      <TableCell className="py-4">
        <span
          className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-medium ${
            status === "Active"
              ? "bg-emerald-500/15 text-emerald-400"
              : status === "Expired"
                ? "bg-white/[0.06] text-[#90909a]"
                : "bg-yellow-500/10 text-yellow-400"
          }`}
        >
          <span
            className={`size-1.5 rounded-full ${
              status === "Active"
                ? "bg-emerald-400"
                : status === "Expired"
                  ? "bg-[#777780]"
                  : "bg-yellow-400"
            }`}
          />
          {status}
        </span>
      </TableCell>

      {/* Deadline and Posted Date */}
      <TableCell className="py-4">
        <div className="min-w-[110px]">
          <p className="whitespace-nowrap text-xs font-medium text-white">
            {formatDeadline(jobData.deadline)}
          </p>

          <p className="mt-1 text-[11px] text-[#6e6e79]">
            {getPostedTime(jobData.createdAt)}
          </p>
        </div>
      </TableCell>

      {/* Actions */}
      <TableCell className="py-4">
        <div className="flex items-center justify-end gap-2">

          <Button
            type="button"
            size="sm"
            onClick={() =>
              toast.info("Job update functionality is coming soon.")
            }
            className="h-8 gap-1.5 bg-[#5148bc]/25 px-3 text-xs text-[#bdb7ff] hover:bg-[#5148bc]/40 hover:text-white"
          >
            <Pencil className="size-3.5" />
            Update
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={deleting}
            onClick={handleDelete}
            aria-label={`Delete ${jobData.title}`}
            title="Delete job"
            className="size-8 shrink-0 text-[#92929c] hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
          >
            {deleting ? (
              <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Trash2 className="size-4" />
            )}
          </Button>

        </div>
      </TableCell>

    </TableRow>
  );
}
