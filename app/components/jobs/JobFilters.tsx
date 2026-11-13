
"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import { MapPin, RotateCcw, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { BrowseFilters } from "@/types/job";



type MultiFilterKey =
  | "jobTypes"
  | "categories"
  | "workModes"
  | "experience";

type JobFiltersProps = {
  filters: BrowseFilters;
  onChange: (filters: BrowseFilters) => void;
  onClear: () => void;
};

const jobTypes = [
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

const workModes = [
  { label: "Remote", value: "remote" },
  { label: "On-site", value: "onsite" },
] as const;

const experiences = [
  { label: "No experience", value: "0" },
  { label: "1–2 Years", value: "1-2" },
  { label: "3–5 Years", value: "3-5" },
  { label: "6+ Years", value: "6+" },
] as const;

//a small component to render each filter section with a title and children
function FilterSection({title,children}: {title: string; children: ReactNode}) {
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-white">
        {title}
      </h3>

      {children}
    </section>
  );
}

//main component function
export default function JobFilters({filters,onChange,onClear}: JobFiltersProps) {
  
    const [locationDraft, setLocationDraft] = useState(filters.location);

  // Keep the location input synchronized with URL changes.
  useEffect(() => {
    // eslint-disable-next-line
    setLocationDraft(filters.location);
  }, [filters.location]);

  const toggleValue = (key: MultiFilterKey,value: string,checked: boolean) => {
      
      const currentValues = filters[key] as string[];

    const updatedValues = checked
      ? [...currentValues, value]
      : currentValues.filter((item) => item !== value);

    onChange({
      ...filters,
      [key]: updatedValues,
    } as BrowseFilters);
  };

  const renderCheckbox = (key: MultiFilterKey,value: string,label: string) => {

      const id = `${key}-${value}`;

    return (
      <div key={id} className="flex items-center gap-3">
        <Checkbox
          id={id}
          checked={(filters[key] as string[]).includes(value)}
          onCheckedChange={(checked) =>
            toggleValue(key, value, checked === true)
          }
          className="border-white/20"
        />

        <Label
          htmlFor={id}
          className="cursor-pointer text-sm font-normal text-muted-foreground hover:text-white"
        >
          {label}
        </Label>
      </div>
    );
  };

  const handleLocationSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onChange({
      ...filters,
      location: locationDraft.trim(),
    });
  };








  return (
    <Card className="border-white/10 bg-[#121318]">
      <CardContent className="space-y-6 p-4">

        {/* Filter heading */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Filters
          </h2>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setLocationDraft("");
              onClear();
            }}
            className="h-8 text-xs text-muted-foreground hover:text-white"
          >
            <RotateCcw size={13} />
            Clear
          </Button>
        </div>

        {/* Job Type */}
        <FilterSection title="Job Type">
          <div className="space-y-3">
            {jobTypes.map((type) =>
              renderCheckbox("jobTypes", type, type)
            )}
          </div>
        </FilterSection>

        {/* Category */}
        <FilterSection title="Category">
          <div className="max-h-60 space-y-3 overflow-y-auto pr-2">
            {categories.map((category) =>
              renderCheckbox("categories",category,category)
            )}
          </div>
        </FilterSection>

        {/* Work Mode */}
        <FilterSection title="Work Mode">
          <div className="space-y-3">
            {workModes.map((mode) =>
              renderCheckbox("workModes",mode.value,mode.label)
            )}
          </div>
        </FilterSection>

        {/* Experience */}
        <FilterSection title="Experience">
          <div className="space-y-3">
            {experiences.map((experience) =>
              renderCheckbox("experience",experience.value,experience.label)
            )}
          </div>
        </FilterSection>

        {/* Location */}
        <FilterSection title="Location">
          <form onSubmit={handleLocationSubmit}>
            <div className="flex gap-2">
              <div className="relative min-w-0 flex-1">
                <MapPin
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <Input
                  value={locationDraft}
                  onChange={(e) =>
                    setLocationDraft(e.target.value)
                  }
                  placeholder="Enter location"
                  className="border-white/10 bg-[#191a20] pl-9 text-white placeholder:text-muted-foreground"
                />
              </div>

              <Button
                type="submit"
                size="icon"
                variant="outline"
                aria-label="Apply location filter"
                className="shrink-0 border-white/10 bg-[#191a20]"
              >
                <Search size={16} />
              </Button>
            </div>
          </form>
        </FilterSection>

      </CardContent>
    </Card>
  );
}
