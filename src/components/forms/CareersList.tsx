"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, ArrowRight } from "lucide-react";

type JobItem = {
  id: string;
  title: string;
  department: string;
  description: string;
  location?: string | null;
  employment_type?: string | null;
};

const JobCard = ({ job }: { job: JobItem }) => (
  <div className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/70 p-6 shadow-sm backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400" />
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
          {job.department}
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          <Link href={`/job/${job.id}`} className="transition hover:text-indigo-700">
            {job.title}
          </Link>
        </h2>
      </div>
      <div className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-100">
        {job.employment_type ?? "Full-time"}
      </div>
    </div>
    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
      {job.location && (
        <div className="flex items-center gap-1.5">
          <MapPin size={16} />
          <span>{job.location}</span>
        </div>
      )}
      <div className="flex items-center gap-1.5">
        <Briefcase size={16} />
        <span>Open role</span>
      </div>
    </div>
    <p className="mt-4 text-sm leading-relaxed text-slate-600 line-clamp-3">
      {job.description}
    </p>
    <div className="mt-6 flex items-center justify-between">
      <div className="text-xs text-slate-400">Updated recently</div>
      <Button asChild>
        <Link href={`/job/${job.id}`}>
          View & Apply
          <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-0.5" />
        </Link>
      </Button>
    </div>
  </div>
);

export function CareersList({ jobs }: { jobs: JobItem[] }) {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("all");
  const [location, setLocation] = useState("all");

  const departments = useMemo(
    () => ["all", ...Array.from(new Set(jobs.map((j) => j.department)))],
    [jobs]
  );
  const locations = useMemo(
    () => [
      "all",
      ...Array.from(
        new Set(jobs.map((j) => j.location).filter(Boolean) as string[])
      ),
    ],
    [jobs]
  );

  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        const searchContent = `${job.title} ${job.department} ${job.description}`.toLowerCase();
        return searchContent.includes(query.toLowerCase());
      })
      .filter((job) => department === "all" || job.department === department)
      .filter((job) => location === "all" || job.location === location);
  }, [jobs, query, department, location]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 rounded-3xl border border-slate-200/80 bg-white/70 p-6 shadow-sm backdrop-blur-lg md:grid-cols-3">
        <Input
          placeholder="Search by title or keyword..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="md:col-span-3"
        />
        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger>
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept} className="capitalize">
                {dept === "all" ? "All Departments" : dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger>
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((loc) => (
              <SelectItem key={loc} value={loc} className="capitalize">
                {loc === "all" ? "All Locations" : loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <h3 className="text-xl font-semibold text-gray-900">
            No matching roles found
          </h3>
          <p className="mt-2 text-gray-500">
            Try adjusting your search filters.
          </p>
        </div>
      )}
    </div>
  );
}
