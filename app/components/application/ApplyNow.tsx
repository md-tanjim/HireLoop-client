"use client";

import { useState, type FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import {
  Briefcase,
  CheckCircle2,
  FileText,
  Link2,
  LoaderCircle,
  Send,
  User,
  Mail,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "@/lib/auth-client";

import { IJob } from "@/types/job";
import { applyForJob, countApplications } from "@/lib/api/applications";
import { isUserPremium } from "@/lib/actions/premiumUser";

type ApplyNowProps = {
  jobData: IJob;
  isExpired?: boolean;
};

// Extract string ID safely whether _id is a string or { $oid: string }
const getJobId = (job: IJob): string => {
  if (!job._id) return "";
  return typeof job._id === "string" ? job._id : job._id.$oid;
};

// Validate that the resume link is a proper http/https URL
const isValidHttpUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const ApplyNow = ({ jobData, isExpired = false }: ApplyNowProps) => {
  const router = useRouter();
  const { data: session, isPending } = useSession();


  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isLoggedIn = async() => {

    if (isPending) return;

    if (!session) {
    
      const search = searchParams.toString();
      const currentUrl = pathname + (search ? `?${search}` : "");

      const loginUrl = new URL("/signin", window.location.origin);
      loginUrl.searchParams.set("callbackUrl", currentUrl);

      router.push(loginUrl.pathname + loginUrl.search);
      return;
    }

    // if (session?.user.accountType === 'seeker') {
    // const countResult = await countApplications(`seekerId=${session?.user.id}`);
    // const premiumStatus =  await isUserPremium(session.user.id);
    // console.log(premiumStatus, "premiummmmmmmmmmmmm");
    // console.log(countResult, "counttttttttttt");
    //     if (!premiumStatus && countResult.count >2) {
    //         toast.error("you have exceeded the free apply limit")
    //         router.push('/payment');

    //         return;
    //     }
    // }

  };

//   const handleCountApplication = async()=>{
//     if (session?.user.accountType === 'seeker') {
//     const countResult = await countApplications(`seekerId=${session?.user.id}`);
//         if (countResult.count >10) {
//             router.push('/payment');

//             return;
//         }
//     }
//   }


  const [open, setOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const jobId = getJobId(jobData);
  const seekerId = session?.user?.id;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!seekerId) {
      toast.error("Please sign in as a job seeker to apply.");
      return;
    }

    if (!jobId) {
      toast.error("Invalid job reference.");
      return;
    }

    const trimmedResumeUrl = resumeUrl.trim();

    if (!trimmedResumeUrl) {
      toast.error("Please provide a link to your resume.");
      return;
    }

    if (!isValidHttpUrl(trimmedResumeUrl)) {
      toast.error(
        "Please enter a valid URL starting with http:// or https://"
      );
      return;
    }

    setSubmitting(true);

    try {
      const result = await applyForJob({
        jobId,
        seekerId,
        resumeUrl: trimmedResumeUrl,
      });

      toast.success(
        result.message || "Application submitted successfully!"
      );

      setHasApplied(true);
      setResumeUrl("");
      setOpen(false);
      router.refresh();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong while submitting your application.";

      // If the backend returns 409 ("You have already applied for this job.")
      if (errorMessage.toLowerCase().includes("already applied")) {
        setHasApplied(true);
        setOpen(false);
      }

      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Disable trigger if the job deadline has passed or the user already applied
  if (isExpired) {
    return (
      <Button
        type="button"
        disabled
        className="h-10 rounded-lg bg-white/10 px-5 text-xs font-semibold text-[#92929c] disabled:opacity-60"
      >
        Applications Closed
      </Button>
    );
  }

  if (hasApplied) {
    return (
      <Button
        type="button"
        disabled
        className="h-10 gap-1.5 rounded-lg bg-emerald-500/15 px-5 text-xs font-semibold text-emerald-400 disabled:opacity-100"
      >
        <CheckCircle2 className="size-4" />
        Applied
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            type="button"
            disabled={isPending}
            className="h-10 rounded-lg bg-white px-5 text-xs font-semibold text-[#111112] hover:bg-white/90 disabled:opacity-50"
            onClick={isLoggedIn}
          >
            Apply Now
          </Button>
        }
      />

      <DialogContent className="border-[#25252b] bg-[#151517] text-white sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-5">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-white">
              Apply for {jobData.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-[#92929c]">
              Submit your application to{" "}
              <span className="font-medium text-[#dedee4]">
                {jobData.companyName}
              </span>
              . Make sure your resume link is publicly accessible.
            </DialogDescription>
          </DialogHeader>

          {/* Job Summary Banner */}
          <div className="flex items-center gap-3 rounded-lg border border-[#25252b] bg-[#202023] p-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#6861ff]/15">
              <Briefcase className="size-4 text-[#aaa5ff]" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-white">
                {jobData.title}
              </p>
              <p className="truncate text-[11px] text-[#92929c]">
                {jobData.companyName} • {jobData.location}
              </p>
            </div>
          </div>

          <FieldGroup className="space-y-4">
            {/* Read-only Applicant Info from Session */}
            {session?.user ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field className="space-y-1.5">
                  <Label
                    htmlFor="applicant-name"
                    className="text-xs text-[#dedee4]"
                  >
                    Your Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[#777780]" />
                    <Input
                      id="applicant-name"
                      value={session.user.name || ""}
                      disabled
                       readOnly
                      className="h-9 border-[#29292f] bg-[#1a1a1d] pl-9 text-xs text-[#92929c] disabled:opacity-80"
                    />
                  </div>
                </Field>

                <Field className="space-y-1.5">
                  <Label
                    htmlFor="applicant-email"
                    className="text-xs text-[#dedee4]"
                  >
                    Your Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[#777780]" />
                    <Input
                      id="applicant-email"
                      value={session.user.email || ""}
                      disabled
                      readOnly
                      className="h-9 border-[#29292f] bg-[#1a1a1d] pl-9 text-xs text-[#92929c] disabled:opacity-80"
                    />
                  </div>
                </Field>
              </div>
            ) : (
              <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3 text-xs text-yellow-300">
                You must be signed in with a job seeker account to submit an
                application.
              </div>
            )}

            {/* Resume URL Input */}
            <Field className="space-y-1.5">
              <Label
                htmlFor="resume-url"
                className="flex items-center justify-between text-xs text-[#dedee4]"
              >
                <span>
                  Resume / CV Link <span className="text-[#6861ff]">*</span>
                </span>
                <span className="text-[10px] font-normal text-[#777780]">
                  Google Drive, Dropbox, etc.
                </span>
              </Label>

              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#858590]" />
                <Input
                  id="resume-url"
                  name="resumeUrl"
                  type="url"
                  required
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  disabled={submitting || !session?.user}
                  placeholder="https://drive.google.com/file/d/..."
                  className="h-10 border-[#29292f] bg-[#202023] pl-10 text-sm text-white placeholder:text-[#777780] focus-visible:border-[#6861ff] focus-visible:ring-2 focus-visible:ring-[#6861ff]/20"
                />
              </div>

              <p className="flex items-center gap-1.5 text-[11px] text-[#777780]">
                <FileText className="size-3 shrink-0" />
                Provide a direct link with view access enabled for recruiters.
              </p>
            </Field>
          </FieldGroup>

          <DialogFooter className="gap-2 pt-2">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  disabled={submitting}
                  className="h-9 border-[#303038] bg-transparent text-xs text-[#c0c0c9] hover:bg-white/5 hover:text-white"
                >
                  Cancel
                </Button>
              }
            />

            <Button
              type="submit"
              disabled={submitting || !session?.user}
              className="h-9 bg-[#5b5bd6] px-4 text-xs font-semibold text-white hover:bg-[#6a63e8] disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <LoaderCircle className="mr-1.5 size-3.5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-1.5 size-3.5" />
                  Submit Application
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyNow;