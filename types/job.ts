
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
