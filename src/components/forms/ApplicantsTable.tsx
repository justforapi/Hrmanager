"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  LayoutGrid,
  List,
  MoreVertical,
  User,
  Star,
  Briefcase,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/dashboard/EmptyState";

type ApplicantRow = {
  id: string;
  name: string;
  email: string;
  photoUrl?: string | null;
  jobTitle: string;
  ai_score: number | null;
  status: string;
  created_at: string;
};

const ApplicantCard = ({
  applicant,
  onPhotoClick,
}: {
  applicant: ApplicantRow;
  onPhotoClick?: (url: string, name: string) => void;
}) => (
  <div className="relative rounded-2xl border border-gray-200/80 bg-white/60 p-6 shadow-sm backdrop-blur-lg">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        {applicant.photoUrl ? (
          <button
            type="button"
            onClick={() => onPhotoClick?.(applicant.photoUrl as string, applicant.name)}
            className="group relative"
            aria-label={`Preview ${applicant.name} photo`}
          >
            <img
              src={applicant.photoUrl}
              alt={applicant.name}
              className="h-14 w-14 rounded-full object-cover ring-2 ring-transparent transition group-hover:ring-indigo-400"
            />
          </button>
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-200">
            <User className="h-7 w-7 text-gray-500" />
          </div>
        )}
        <div>
          <Link
            href={`/admin/applicant/${applicant.id}`}
            className="font-semibold text-gray-900 hover:underline"
          >
            {applicant.name}
          </Link>
          <p className="text-sm text-gray-500">{applicant.email}</p>
        </div>
      </div>
      <StatusBadge status={applicant.status} />
    </div>
    <div className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
      <div className="flex items-center gap-2 text-gray-600">
        <Briefcase className="h-4 w-4 text-gray-400" />
        <span>{applicant.jobTitle}</span>
      </div>
      <div className="flex items-center gap-2 text-gray-600">
        <Star className="h-4 w-4 text-gray-400" />
        <span>AI Score: {applicant.ai_score ?? "N/A"}</span>
      </div>
      <div className="flex items-center gap-2 text-gray-600">
        <Calendar className="h-4 w-4 text-gray-400" />
        <span>{new Date(applicant.created_at).toLocaleDateString()}</span>
      </div>
    </div>
    <div className="absolute bottom-4 right-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/admin/applicant/${applicant.id}`}>View Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>Contact Applicant</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
);

const ApplicantListItem = ({
  applicant,
  onPhotoClick,
}: {
  applicant: ApplicantRow;
  onPhotoClick?: (url: string, name: string) => void;
}) => (
  <div className="flex items-center justify-between rounded-2xl border border-gray-200/80 bg-white/60 p-4 shadow-sm backdrop-blur-lg">
    <div className="flex items-center gap-4">
      {applicant.photoUrl ? (
        <button
          type="button"
          onClick={() => onPhotoClick?.(applicant.photoUrl as string, applicant.name)}
          className="group relative"
          aria-label={`Preview ${applicant.name} photo`}
        >
          <img
            src={applicant.photoUrl}
            alt={applicant.name}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-transparent transition group-hover:ring-indigo-400"
          />
        </button>
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
          <User className="h-5 w-5 text-gray-500" />
        </div>
      )}
      <div>
        <Link
          href={`/admin/applicant/${applicant.id}`}
          className="font-semibold text-gray-900 hover:underline"
        >
          {applicant.name}
        </Link>
        <p className="text-sm text-gray-500">{applicant.jobTitle}</p>
      </div>
    </div>
    <div className="hidden items-center gap-6 md:flex">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Star className="h-4 w-4 text-gray-400" />
        <span>{applicant.ai_score ?? "N/A"}</span>
      </div>
      <StatusBadge status={applicant.status} />
      <span className="text-sm text-gray-500">
        {new Date(applicant.created_at).toLocaleDateString()}
      </span>
    </div>
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" asChild>
        <Link href={`/admin/applicant/${applicant.id}`}>View</Link>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Contact Applicant</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
);

export function ApplicantsTable({ applicants }: { applicants: ApplicantRow[] }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [preview, setPreview] = useState<{ url: string; name: string } | null>(null);

  const handlePhotoClick = (url: string | null | undefined, name: string) => {
    if (!url) return;
    setPreview({ url, name });
  };

  const filteredApplicants = useMemo(() => {
    return applicants
      .filter((app) => {
        if (statusFilter === "all") return true;
        return app.status === statusFilter;
      })
      .filter((app) => {
        const searchContent = `${app.name} ${app.email} ${app.jobTitle}`.toLowerCase();
        return searchContent.includes(query.toLowerCase());
      });
  }, [applicants, query, statusFilter]);

  const allStatuses = useMemo(
    () => ["all", ...Array.from(new Set(applicants.map((a) => a.status)))],
    [applicants]
  );

  return (
    <div className="space-y-6">
      <Dialog
        open={!!preview}
        onOpenChange={(open) => {
          if (!open) setPreview(null);
        }}
      >
        <DialogContent className="w-[95vw] max-w-3xl overflow-hidden p-0">
          {preview ? (
            <img
              src={preview.url}
              alt={`${preview.name} profile`}
              className="max-h-[75vh] w-full object-contain"
            />
          ) : null}
        </DialogContent>
      </Dialog>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex w-full flex-col items-stretch gap-4 sm:flex-row sm:items-center">
          <Input
            placeholder="Search by name, email, or job..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:max-w-xs"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {allStatuses.map((status) => (
                <SelectItem key={status} value={status} className="capitalize">
                  {status === "all" ? "All Statuses" : status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={layout === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setLayout("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={layout === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setLayout("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {filteredApplicants.length > 0 ? (
        layout === "grid" ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredApplicants.map((applicant) => (
              <ApplicantCard
                key={applicant.id}
                applicant={applicant}
                onPhotoClick={handlePhotoClick}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplicants.map((applicant) => (
              <ApplicantListItem
                key={applicant.id}
                applicant={applicant}
                onPhotoClick={handlePhotoClick}
              />
            ))}
          </div>
        )
      ) : (
        <EmptyState
          title="No Applicants Found"
          description="No applicants match your current filters. Try adjusting your search."
        />
      )}
    </div>
  );
}
