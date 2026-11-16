export type UserRole = "admin" | "recruiter" | "seeker";

export type MongoDate = string | Date | { $date: string };

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  accountType: UserRole;
  status: "active" | "suspended";
  createdAt: MongoDate;
  updatedAt: MongoDate;
};