
export type IJob = {
  _id: string | { $oid: string };
  title: string;
  companyName: string;
  category: string;
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
