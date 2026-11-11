
import {
  Code2,
  Palette,
  Megaphone,
  TrendingUp,
  Calculator,
  Users,
  Headset,
  BriefcaseBusiness,
  GraduationCap,
  HeartPulse,
  Shapes,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

export const categories = [
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
] as const;

export type JobCategory = (typeof categories)[number];

export const categoryIcons: Record<JobCategory, LucideIcon> = {
  "Engineering & Tech": Code2,
  "Design & Creative": Palette,
  Marketing: Megaphone,
  Sales: TrendingUp,
  "Finance & Accounting": Calculator,
  "Human Resources": Users,
  "Customer Support": Headset,
  "Business & Management": BriefcaseBusiness,
  Education: GraduationCap,
  Healthcare: HeartPulse,
  Other: Shapes,
};
