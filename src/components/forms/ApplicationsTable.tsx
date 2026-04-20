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
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PillBadge } from "@/components/ui/PillBadge";
import { Button } from "@/components/ui/button";
import { List, Grid } from "lucide-react";

type ApplicationRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  jobTitle: string;
  ai_score: number | null;
  ai_decision: string | null;
  status: string | null;
  created_at: string;
};

const ApplicationCard = ({ application }: { application: ApplicationRow }) => {
  const scoreColor =
    application.ai_score === null
      ? "gray"
      : application.ai_score >= 90
      ? "green"
      : application.ai_score >= 70
      ? "blue"
      : application.ai_score >= 50
      ? "amber"
      : "gray";

  return (
    <div className="relative rounded-2xl border border-gray-200/80 bg-white/60 p-6 shadow-sm backdrop-blur-lg transition-all hover:shadow-md">
      <div className="flex flex-col space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {application.full_name}
            </h3>
            <p className="text-sm text-gray-500">{application.jobTitle}</p>
          </div>
          {application.ai_score !== null && (
            <PillBadge
              variant={scoreColor}
              text={`Score: ${application.ai_score}`}
            />
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <StatusBadge status={application.status ?? "submitted"} />
          <p className="text-xs text-gray-400">
            {new Date(application.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="!mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">AI Decision:</span>
            <PillBadge
              text={application.ai_decision ?? "N/A"}
              variant={
                application.ai_decision === "shortlist"
                  ? "green"
                  : application.ai_decision === "review"
                  ? "amber"
                  : "gray"
              }
            />
          </div>
          <Button size="sm" variant="outline" asChild>
            <Link href={`/admin/application/${application.id}`}>View</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export function ApplicationsTable({
  applications,
}: {
  applications: ApplicationRow[];
}) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [layout, setLayout] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    return applications
      .filter((app) => {
        if (statusFilter === "all") return true;
        return app.status === statusFilter;
      })
      .filter((app) => {
        const target = `${app.full_name} ${app.email} ${app.jobTitle}`.toLowerCase();
        return target.includes(query.toLowerCase());
      });
  }, [applications, query, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row">
        <Input
          placeholder="Search by name, email, or job..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="flex-grow"
        />
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="shortlisted">Shortlisted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <div className="hidden rounded-lg border bg-white p-1 lg:flex">
            <Button
              variant={layout === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setLayout("list")}
            >
              <List className="h-5 w-5" />
            </Button>
            <Button
              variant={layout === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setLayout("grid")}
            >
              <Grid className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div
          className={
            layout === "grid"
              ? "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
              : "space-y-4"
          }
        >
          {filtered.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </div>
      ) : (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white/60 text-center">
          <h3 className="text-lg font-semibold text-gray-700">
            No applications found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filters.
          </p>
        </div>
      )}
    </div>
  );
}
