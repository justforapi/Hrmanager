"use client";

import { useMemo, useState } from "react";
import { Job } from "@/lib/supabase/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PillBadge } from "@/components/ui/PillBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Briefcase, MapPin, Edit, Trash2, XCircle } from "lucide-react";

const JobCard = ({
  job,
  onEdit,
  onClose,
  onDelete,
}: {
  job: Job;
  onEdit: (job: Job) => void;
  onClose: (job: Job) => void;
  onDelete: (job: Job) => void;
}) => (
  <div className="rounded-2xl border border-gray-200/80 bg-white/60 p-6 shadow-sm backdrop-blur-lg transition-all hover:shadow-md">
    <div className="flex flex-col justify-between space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Briefcase className="h-3 w-3" />
              <span>{job.department}</span>
            </div>
            {job.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{job.location}</span>
              </div>
            )}
          </div>
        </div>
        <PillBadge variant={job.status === "open" ? "green" : "amber"}>
          {job.status}
        </PillBadge>
      </div>

      {(job.employment_type || job.remote_type) && (
        <div className="flex flex-wrap gap-2">
          {job.employment_type && (
            <PillBadge>{job.employment_type}</PillBadge>
          )}
          {job.remote_type && <PillBadge>{job.remote_type}</PillBadge>}
        </div>
      )}

      <div className="!mt-6 flex items-center justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(job)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
        {job.status === "open" && (
          <Button variant="outline" size="sm" onClick={() => onClose(job)}>
            <XCircle className="mr-2 h-4 w-4" />
            Close
          </Button>
        )}
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(job)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  </div>
);

export function JobsTable({
  jobs,
  onEdit,
  onClose,
  onDelete,
}: {
  jobs: Job[];
  onEdit: (job: Job) => void;
  onClose: (job: Job) => void;
  onDelete: (job: Job) => void;
}) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return jobs
      .filter((job) => {
        if (statusFilter === "all") return true;
        return job.status === statusFilter;
      })
      .filter((job) =>
        `${job.title} ${job.department}`
          .toLowerCase()
          .includes(query.toLowerCase())
      );
  }, [jobs, query, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row">
        <Input
          placeholder="Search by title or department..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="flex-grow"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {filtered.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onEdit={onEdit}
            onClose={onClose}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
