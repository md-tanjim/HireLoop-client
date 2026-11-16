
export type IJob = {
  _id: string | { $oid: string };
  title: string;
  companyName: string;
  category: string;
  experience: number;
  jobType: string;
  isRemote: boolean;
  location: string;
  deadline: string;
  minSalary: number | null;
  maxSalary: number | null;
  frequency: string;
  responsibilities: string;
  qualifications: string;
  createdAt: string;
  createdBy: string;
  createdByName: string;
  createdByEmail: string;
  applicantCount : number; //temporery field, not stored in DB
};





export type JobSort = "recent" | "oldest" | "salary-high" | "salary-low";

export type ExperienceRange = "0" | "1-2" | "3-5" | "6+";

export type WorkMode = "remote" | "onsite";

export type BrowseFilters = {
  jobTypes: string[];
  categories: string[];
  workModes: WorkMode[];
  experience: ExperienceRange[];
  location: string;
};

export type JobsResponse = {
  jobs: IJob[];
  totalJobs: number;
  currentPage: number;
  totalPages: number;
};


export type ApplicationStatus =
  | "pending"
  | "reviewing"
  | "shortlisted"
  | "rejected"
  | "hired"
  | "withdrawn";

export type Candidate = {
  _id: string;
  jobId: string;
  seekerId: string;
  recruiterId: string;

  applicant: {
    name: string;
    email: string;
  };

  resumeUrl: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
  recruiterNote: string;
};

export type JobWithCandidates = {
  _id: string;
  title: string;
  companyName: string;
  category: string;
  jobType: string;
  isRemote: boolean;
  location: string;
  deadline: string;
  minSalary: number;
  maxSalary: number;
  frequency: string;
  responsibilities: string;
  qualifications: string;
  createdAt: string;
  createdBy: string;
  createdByName: string;
  createdByEmail: string;
  experience: number;

  candidates: Candidate[];
};