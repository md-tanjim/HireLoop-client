import Image from "next/image"
import Link from "next/link"
import {
  Briefcase,
  Building2,
  Camera,
  LocateFixed,
  Search,
  Star,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"

const trendingPositions = [
  "Product Designer",
  "AI Engineering",
  "Dev-ops Engineer",
]

const stats = [
  { icon: Camera, value: "50K", label: "Active Jobs" },
  { icon: Building2, value: "12K", label: "Companies" },
  { icon: Users, value: "2M", label: "Job Seekers" },
  { icon: Star, value: "97%", label: "Satisfaction Rate" },
]

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#0a0a0a]">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(ellipse_at_top,rgba(91,91,214,0.18),transparent_65%)]" />
        <div className="absolute top-[40%] left-1/2 h-[700px] w-[1100px] -translate-x-1/2 rounded-full bg-[#4f46e5]/10 blur-[160px]" />
        <Image
          src="/assets/globe-clean.png"
          alt=""
          width={1440}
          height={1882}
          loading="eager"
          fetchPriority="high"
          className="absolute top-0 left-1/2 w-[180%] max-w-none -translate-x-1/2 -translate-y-[5%] sm:w-[140%] lg:w-full lg:max-w-[1440px]"
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-6 pt-20 pb-8 sm:pt-24 lg:min-h-[1200px] lg:pt-28 lg:pb-12">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="hidden items-center gap-2 sm:flex">
              <span className="size-1 rotate-45 bg-white/25" />
              <span className="h-px w-16 bg-linear-to-r from-transparent to-white/25" />
            </span>

            <div className="flex items-center gap-2.5 rounded-full border border-white/[0.06] bg-white/[0.04] px-4 py-1.5 shadow-[0_0_40px_-12px_rgba(91,91,214,0.5)] backdrop-blur-sm">
              <span className="flex size-5 items-center justify-center rounded-[5px] bg-[#ff5a1f]">
                <Briefcase className="size-3 text-white" strokeWidth={2.5} />
              </span>
              <span className="text-sm font-semibold text-white">50,000+</span>
              <span className="text-[10px] font-semibold tracking-[0.14em] text-white/50 uppercase">
                New Jobs This Month
              </span>
            </div>

            <span className="hidden items-center gap-2 sm:flex">
              <span className="h-px w-16 bg-linear-to-l from-transparent to-white/25" />
              <span className="size-1 rotate-45 bg-white/25" />
            </span>
          </div>

          <h1 className="mt-7 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-7xl">
            Find Your Dream Job Today
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-6 text-white/55 sm:text-base">
            HireLoop connects top talent with world-class companies. Browse
            thousands of curated opportunities and land your next role — faster.
          </p>

          <form
            action="/jobs"
            className="mt-8 flex w-full max-w-3xl flex-col gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] p-2 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur-md sm:flex-row sm:items-center"
          >
            <div className="flex flex-1 items-center gap-3 rounded-lg px-3 py-2.5">
              <Search className="size-4 shrink-0 text-white/40" />
              <input
                name="q"
                type="text"
                placeholder="Job title, skill or company"
                aria-label="Job title, skill or company"
                className="w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-white/35"
              />
            </div>

            <span className="mx-3 h-px bg-white/10 sm:mx-0 sm:h-8 sm:w-px" />

            <div className="flex flex-1 items-center gap-3 rounded-lg px-3 py-2.5">
              <LocateFixed className="size-4 shrink-0 text-white/40" />
              <input
                name="location"
                type="text"
                placeholder="Location or Remote"
                aria-label="Location or Remote"
                className="w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-white/35"
              />
            </div>

            <Button
              type="submit"
              size="icon"
              aria-label="Search jobs"
              className="h-11 w-full shrink-0 rounded-lg bg-[#5b5bd6] bg-linear-to-r from-[#5b5bd6] to-[#6a5ef7] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] hover:from-[#6a63e8] hover:to-[#7a6cff] sm:size-11 sm:w-11"
            >
              <Search className="size-5" />
            </Button>
          </form>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-white/35">Trending Position</span>
            {trendingPositions.map((position) => (
              <Link
                key={position}
                href={`/jobs?q=${encodeURIComponent(position)}`}
                className="rounded-full border border-white/[0.06] bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-white/60 transition-colors hover:border-white/10 hover:bg-white/[0.08] hover:text-white"
              >
                {position}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-32 flex flex-col items-center lg:mt-auto">
          <p className="max-w-2xl text-center text-2xl leading-snug font-medium tracking-tight text-balance text-white/90 sm:text-3xl lg:text-4xl">
            Assisting over 15,000 job seekers find their dream positions.
          </p>

          <div className="mt-10 grid w-full grid-cols-2 gap-3 md:grid-cols-4 lg:mt-12">
            {stats.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="flex min-h-[140px] flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0d0d0d]/95 p-5 shadow-[0_20px_60px_-35px_rgba(0,0,0,0.9)] backdrop-blur-sm lg:min-h-[180px] lg:p-6"
              >
                <Icon className="size-5 text-white/55" strokeWidth={1.7} />
                <div>
                  <p className="text-4xl font-semibold tracking-tight text-white lg:text-5xl">
                    {value}
                  </p>
                  <p className="mt-1 text-xs text-white/50 lg:text-sm">
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
