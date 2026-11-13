
"use client";

import type { FormEvent } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type JobSearchProps = {
  value: string;
  onChange: (value: string) => void;
  onSearch: (event: FormEvent<HTMLFormElement>) => void;
};

export default function JobSearch({value,onChange,onSearch}: JobSearchProps) {

    
  return (
    <form
      onSubmit={onSearch}
      className="flex flex-col gap-3 rounded-xl border border-white/10 bg-[#121318] p-4 sm:flex-row"
    >
      <div className="relative flex-1">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />

        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by job title, company, keywords..."
          className="h-11 border-white/10 bg-[#191a20] pl-10 text-white placeholder:text-muted-foreground"
        />
      </div>

      <Button type="submit" className="h-11 px-6">
        Search Jobs
      </Button>
    </form>
  );
}
