import { cn } from "@/lib/utils";
import { ApplicationStatus } from "@/lib/supabase/types";

type StatusBadgeProps = {
  status: ApplicationStatus | string;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "rounded-md px-2.5 py-1 text-xs font-semibold capitalize tracking-wide",
        {
          "bg-amber-50 text-amber-800": status === "submitted",
          "bg-amber-100 text-amber-800": status === "reviewed",
          "bg-green-100 text-green-800": status === "shortlisted",
          "bg-rose-100 text-rose-800": status === "rejected",
          "bg-slate-100 text-slate-800": !["submitted", "reviewed", "shortlisted", "rejected"].includes(status),
        }
      )}
    >
      {status}
    </span>
  );
}