
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import {
    ArrowRight,
    Building2,
    CalendarDays,
    Clock3,
    DollarSign,
    Globe2,
    LoaderCircle,
    MapPin,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { IJob } from "@/types/job";




export type JobFormValues = {
    title: string;
    companyName: string;
    category: string;
    experience: number | null;
    jobType: string;
    isRemote: boolean;
    location: string;
    deadline: string;
    minSalary: number | null;
    maxSalary: number | null;
    frequency: string;
    responsibilities: string;
    qualifications: string;
};

type JobFormProps = {
    mode: "create" | "update";
    initialData?: Partial<IJob>;
    onSubmit: (
        jobData: JobFormValues
    ) => Promise<{ message?: string } | null | void>;
};

type JobType = "Full-time" | "Part-time" | "Contract" | "Internship";

const jobTypes: JobType[] = [
    "Full-time",
    "Part-time",
    "Contract",
    "Internship",
];

const categories = [
    "Engineering & Tech",
    "Design & Creative",
    "Marketing",
    "Sales",
    "Finance & Accounting",
    "Human Resources",
    "Customer Support",
    "Business & Management",
    "Education",
    "Healthcare",
    "Other",
];

const frequencies = [
    "per hour",
    "per day",
    "per week",
    "per month",
    "per year",
];

const inputClasses =
    "h-10 border-[#29292f] bg-[#202023] text-sm text-white placeholder:text-[#777780] focus-visible:border-[#6861ff] focus-visible:ring-2 focus-visible:ring-[#6861ff]/20";

const selectClasses =
    "h-10 w-full border-[#29292f] bg-[#202023] text-sm text-white focus:ring-[#6861ff]/20";

function SectionHeading({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="mb-5 flex items-center gap-2 text-sm font-medium text-white">
            <span className="size-1.5 rounded-full bg-[#6861ff]" />
            {children}
        </div>
    );
}

function formatDateValue(date?: string) {
    if (!date) return "";

    // Handles ISO dates and normal YYYY-MM-DD strings
    return date.slice(0, 10);
}

export default function JobForm({
    mode,
    initialData,
    onSubmit,
}: JobFormProps) {
    const router = useRouter();

    const isUpdate = mode === "update";

    const [loading, setLoading] = useState(false);

    const [jobType, setJobType] = useState<JobType>(
        (initialData?.jobType as JobType) || "Full-time"
    );

    const [category, setCategory] = useState(
        initialData?.category || ""
    );

    const [experience, setExperience] = useState(
        initialData?.experience ?? ""
    );

    const [frequency, setFrequency] = useState(
        initialData?.frequency || "per hour"
    );

    const [isRemote, setIsRemote] = useState(
        initialData?.isRemote ?? false
    );

    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const minSalaryValue = String(
            formData.get("minSalary") ?? ""
        ).trim();

        const maxSalaryValue = String(
            formData.get("maxSalary") ?? ""
        ).trim();

        const minSalary = minSalaryValue
            ? Number(minSalaryValue)
            : null;

        const maxSalary = maxSalaryValue
            ? Number(maxSalaryValue)
            : null;


        const experienceValue = String(
            formData.get("experience") ?? ""
        ).trim();

        const experience = experienceValue
            ? Number(experienceValue)
            : NaN;

        // Validate category
        if (!category) {
            toast.error("Please select a job category.");
            return;
        }

        // Validate job type
        if (!jobType) {
            toast.error("Please select a job type.");
            return;
        }

        // Validate experience
        if (!Number.isFinite(experience) || experience < 0) {
            toast.error("Please enter valid years of experience (0 or more).");
            return;
        }

        // Validate salary

        if (
            (minSalary !== null &&
                (!Number.isFinite(minSalary) || minSalary < 0)) ||
            (maxSalary !== null &&
                (!Number.isFinite(maxSalary) || maxSalary < 0))
        ) {
            toast.error("Please enter valid salary amounts.");
            return;
        }

        if (
            minSalary !== null &&
            maxSalary !== null &&
            minSalary > maxSalary
        ) {
            toast.error(
                "Minimum salary cannot exceed maximum salary."
            );
            return;
        }

        const jobData: JobFormValues = {
            title: String(formData.get("title") ?? "").trim(),
            companyName: String(
                formData.get("companyName") ?? ""
            ).trim(),
            category,
            experience,
            jobType,
            isRemote,
            location: String(
                formData.get("location") ?? ""
            ).trim(),
            deadline: String(
                formData.get("deadline") ?? ""
            ),
            minSalary,
            maxSalary,
            frequency,
            responsibilities: String(
                formData.get("responsibilities") ?? ""
            ).trim(),
            qualifications: String(
                formData.get("qualifications") ?? ""
            ).trim(),
        };

        setLoading(true);

        try {
            const result = await onSubmit(jobData);

            toast.success(
                result?.message ||
                (isUpdate
                    ? "Job updated successfully!"
                    : "Job published successfully!")
            );

            router.push("/dashboard/recruiter/manage-jobs");
            router.refresh();

        } catch (error) {
            console.error("Job form submission error:", error);

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#111112] px-4 py-6 text-white sm:px-6 lg:px-8">

            <div className="mx-auto w-full max-w-7xl">

                {/* Page Header */}
                <div className="mb-7 flex flex-col justify-between gap-4 border-b border-white/[0.06] pb-6 sm:flex-row sm:items-center">

                    <div>

                        <div className="mb-2 flex items-center gap-1.5 text-xs text-[#898993]">
                            <span>Manage Jobs</span>
                            <span>/</span>
                            <span className="text-[#c4c4d0]">
                                {isUpdate
                                    ? "Update Job Post"
                                    : "Create New Listing"}
                            </span>
                        </div>

                        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                            {isUpdate
                                ? "Update Job Post"
                                : "Post a New Job"}
                        </h1>

                        <p className="mt-1 text-xs text-[#92929c] sm:text-sm">
                            {isUpdate
                                ? "Modify position specifications, compensation range, and candidate requirements for this listing."
                                : "Fill in the position specifications to attract qualified talent across our network."}
                        </p>

                    </div>

                    {/* Header Submit Button */}
                    <Button
                        type="submit"
                        form="job-form"
                        disabled={loading}
                        className="h-10 shrink-0 rounded-lg bg-[#5b5bd6] px-5 text-sm font-semibold text-white shadow-lg shadow-[#5b5bd6]/20 hover:bg-[#6a63e8] disabled:opacity-60"
                    >
                        {loading ? (
                            <>
                                <LoaderCircle className="mr-2 size-4 animate-spin" />
                                {isUpdate ? "Updating..." : "Publishing..."}
                            </>
                        ) : (
                            <>
                                {isUpdate ? "Update Job" : "Publish Job"}
                                <ArrowRight className="ml-2 size-4" />
                            </>
                        )}
                    </Button>

                </div>

                {/* Job Form */}
                <form
                    id="job-form"
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* 1. Basic Information */}
                    <Card className="border-[#202024] bg-[#151517] text-white shadow-none">
                        <CardContent className="p-5 sm:p-6">

                            <SectionHeading>
                                1. Basic Information
                            </SectionHeading>

                            <div className="space-y-4">

                                {/* Job Title */}
                                <div className="space-y-1.5">

                                    <Label htmlFor="title" className="text-xs text-[#dedee4]">
                                        Job Title <span className="text-[#6861ff]">*</span>
                                    </Label>

                                    <Input
                                        id="title"
                                        name="title"
                                        required
                                        defaultValue={initialData?.title || ""}
                                        placeholder="e.g. Frontend Developer"
                                        className={inputClasses}
                                    />

                                </div>

                                {/* Company and Category */}
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                                    <div className="space-y-1.5">

                                        <Label htmlFor="companyName" className="text-xs text-[#dedee4]">
                                            Company Name <span className="text-[#6861ff]">*</span>
                                        </Label>

                                        <div className="relative">

                                            <Building2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#858590]" />

                                            <Input
                                                id="companyName"
                                                name="companyName"
                                                required
                                                defaultValue={initialData?.companyName || ""}
                                                placeholder="Enter your company name"
                                                className={`${inputClasses} pl-10`}
                                            />

                                        </div>
                                    </div>

                                    <div className="space-y-1.5">

                                        <Label className="text-xs text-[#dedee4]">
                                            Job Category <span className="text-[#6861ff]">*</span>
                                        </Label>

                                        <Select
                                            value={category}
                                            onValueChange={(value) =>
                                                setCategory(value ?? "")
                                            }
                                        >
                                            <SelectTrigger className={selectClasses}>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>

                                            <SelectContent className="border-[#29292f] bg-[#202023] text-white">
                                                {categories.map((item) => (
                                                    <SelectItem
                                                        key={item}
                                                        value={item}
                                                        className="focus:bg-white/10 focus:text-white"
                                                    >
                                                        {item}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                    </div>

                                    {/* Experience Level */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="experience" className="text-xs text-[#dedee4]">
                                            Experience (Years) <span className="text-[#6861ff]">*</span>
                                        </Label>

                                        <Input
                                            id="experience"
                                            name="experience"
                                            type="number"
                                            min="0"
                                            step="1"
                                            required
                                            defaultValue={initialData?.experience ?? ""}
                                            placeholder="e.g. 2"
                                            className={inputClasses}
                                        />
                                    </div>

                                </div>

                                {/* Job Type */}
                                <div className="space-y-2">

                                    <Label className="text-xs text-[#dedee4]">
                                        Job Type <span className="text-[#6861ff]">*</span>
                                    </Label>

                                    <div
                                        role="radiogroup"
                                        aria-label="Job type"
                                        className="grid grid-cols-2 gap-2 sm:grid-cols-4"
                                    >
                                        {jobTypes.map((type) => {
                                            const selected = jobType === type;

                                            return (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    role="radio"
                                                    aria-checked={selected}
                                                    onClick={() => setJobType(type)}
                                                    className={`h-10 rounded-lg border text-xs font-medium transition ${selected
                                                        ? "border-[#6861ff] bg-[#292638] text-white"
                                                        : "border-[#242429] bg-[#202023] text-[#9999a3] hover:border-[#45454f] hover:text-white"
                                                        }`}
                                                >
                                                    {type}
                                                </button>
                                            );
                                        })}
                                    </div>

                                </div>

                            </div>
                        </CardContent>
                    </Card>

                    {/* 2. Location, Compensation & Timeline */}
                    <Card className="border-[#202024] bg-[#151517] text-white shadow-none">
                        <CardContent className="p-5 sm:p-6">

                            <SectionHeading>
                                2. Location, Compensation & Timeline
                            </SectionHeading>

                            <div className="space-y-4">

                                {/* Remote Work */}
                                <div className="flex items-center justify-between gap-4 rounded-lg border border-[#25252b] bg-[#202023] p-3">

                                    <div className="flex items-center gap-3">

                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#6861ff]/15">
                                            <Globe2 className="size-4 text-[#aaa5ff]" />
                                        </div>

                                        <div>
                                            <Label
                                                htmlFor="remote"
                                                className="cursor-pointer text-xs font-medium text-white"
                                            >
                                                Remote Work Allowed (isRemote)
                                            </Label>

                                            <p className="mt-1 text-[11px] text-[#92929c]">
                                                Enable worldwide or distributed candidate applications
                                            </p>
                                        </div>

                                    </div>

                                    <Switch
                                        id="remote"
                                        checked={isRemote}
                                        onCheckedChange={setIsRemote}
                                    />

                                </div>

                                {/* Location and Deadline */}
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                                    <div className="space-y-1.5">

                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="location" className="text-xs text-[#dedee4]">
                                                Job Location (location)
                                            </Label>

                                            <span className="text-[10px] text-[#656570]">
                                                Required
                                            </span>
                                        </div>

                                        <div className="relative">

                                            <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#858590]" />

                                            <Input
                                                id="location"
                                                name="location"
                                                required
                                                defaultValue={initialData?.location || ""}
                                                placeholder="e.g. New York, USA"
                                                className={`${inputClasses} pl-10`}
                                            />

                                        </div>
                                    </div>

                                    <div className="space-y-1.5">

                                        <Label htmlFor="deadline" className="text-xs text-[#dedee4]">
                                            Application Deadline (deadline)
                                            <span className="text-[#6861ff]"> *</span>
                                        </Label>

                                        <div className="relative">

                                            <CalendarDays className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#858590]" />

                                            <Input
                                                id="deadline"
                                                name="deadline"
                                                type="date"
                                                required
                                                min={new Date().toISOString().split("T")[0]}
                                                defaultValue={formatDateValue(initialData?.deadline)}
                                                className={`${inputClasses} pl-10 [color-scheme:dark]`}
                                            />

                                        </div>
                                    </div>

                                </div>

                                {/* Salary */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                                    <div className="space-y-1.5">

                                        <Label htmlFor="minSalary" className="text-xs text-[#dedee4]">
                                            Min Salary / Rate
                                        </Label>

                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#858590]" />

                                            <Input
                                                id="minSalary"
                                                name="minSalary"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                defaultValue={initialData?.minSalary ?? ""}
                                                placeholder="25"
                                                className={`${inputClasses} pl-10`}
                                            />
                                        </div>

                                    </div>

                                    <div className="space-y-1.5">

                                        <Label htmlFor="maxSalary" className="text-xs text-[#dedee4]">
                                            Max Salary / Rate
                                        </Label>

                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#858590]" />

                                            <Input
                                                id="maxSalary"
                                                name="maxSalary"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                defaultValue={initialData?.maxSalary ?? ""}
                                                placeholder="40"
                                                className={`${inputClasses} pl-10`}
                                            />
                                        </div>

                                    </div>

                                    <div className="space-y-1.5">

                                        <Label className="text-xs text-[#dedee4]">
                                            Frequency
                                        </Label>

                                        <Select
                                            value={frequency}
                                            onValueChange={(value) =>
                                                setFrequency(value ?? "per hour")
                                            }
                                        >
                                            <SelectTrigger className={selectClasses}>
                                                <div className="flex items-center gap-2">
                                                    <Clock3 className="size-4 text-[#858590]" />
                                                    <SelectValue placeholder="Select frequency" />
                                                </div>
                                            </SelectTrigger>

                                            <SelectContent className="border-[#29292f] bg-[#202023] text-white">
                                                {frequencies.map((item) => (
                                                    <SelectItem
                                                        key={item}
                                                        value={item}
                                                        className="focus:bg-white/10 focus:text-white"
                                                    >
                                                        {item}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                    </div>

                                </div>

                            </div>
                        </CardContent>
                    </Card>

                    {/* 3. Responsibilities & Requirements */}
                    <Card className="border-[#202024] bg-[#151517] text-white shadow-none">
                        <CardContent className="p-5 sm:p-6">

                            <SectionHeading>
                                3. Responsibilities & Requirements
                            </SectionHeading>

                            <div className="space-y-4">

                                {/* Responsibilities */}
                                <div className="space-y-1.5">

                                    <Label
                                        htmlFor="responsibilities"
                                        className="text-xs text-[#dedee4]"
                                    >
                                        Key Responsibilities
                                        <span className="text-[#6861ff]"> *</span>
                                    </Label>

                                    <Textarea
                                        id="responsibilities"
                                        name="responsibilities"
                                        required
                                        minLength={10}
                                        defaultValue={initialData?.responsibilities || ""}
                                        placeholder="Describe the main responsibilities of this position..."
                                        className="min-h-28 resize-y border-[#29292f] bg-[#202023] text-sm leading-relaxed text-white placeholder:text-[#777780] focus-visible:border-[#6861ff] focus-visible:ring-2 focus-visible:ring-[#6861ff]/20"
                                    />

                                </div>

                                {/* Qualifications */}
                                <div className="space-y-1.5">

                                    <Label
                                        htmlFor="qualifications"
                                        className="text-xs text-[#dedee4]"
                                    >
                                        Qualifications & Requirements
                                        <span className="text-[#6861ff]"> *</span>
                                    </Label>

                                    <Textarea
                                        id="qualifications"
                                        name="qualifications"
                                        required
                                        minLength={10}
                                        defaultValue={initialData?.qualifications || ""}
                                        placeholder="List the required skills, experience, education, and qualifications..."
                                        className="min-h-28 resize-y border-[#29292f] bg-[#202023] text-sm leading-relaxed text-white placeholder:text-[#777780] focus-visible:border-[#6861ff] focus-visible:ring-2 focus-visible:ring-[#6861ff]/20"
                                    />

                                </div>

                            </div>
                        </CardContent>
                    </Card>

                    {/* Bottom Actions */}
                    <div className="flex flex-col-reverse justify-end gap-3 pb-8 sm:flex-row">

                        <Button
                            type="button"
                            variant="outline"
                            disabled={loading}
                            onClick={() => router.back()}
                            className="h-10 border-[#303038] bg-transparent px-5 text-sm text-[#c0c0c9] hover:bg-white/5 hover:text-white"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="h-10 bg-[#5b5bd6] px-6 text-sm font-semibold text-white hover:bg-[#6a63e8] disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <LoaderCircle className="mr-2 size-4 animate-spin" />
                                    {isUpdate ? "Updating..." : "Publishing..."}
                                </>
                            ) : (
                                <>
                                    {isUpdate ? "Update Job" : "Publish Job"}
                                    <ArrowRight className="ml-2 size-4" />
                                </>
                            )}
                        </Button>

                    </div>

                </form>
            </div>
        </div>
    );
}
