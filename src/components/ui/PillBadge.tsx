import { cn } from "@/lib/utils";

type PillBadgeProps = {
  text?: string;
  children?: React.ReactNode;
  variant?: "green" | "amber" | "blue" | "gray" | "dark" | "accent" | "warning";
};

export function PillBadge({ text, children, variant = "gray" }: PillBadgeProps) {
  const content = text ?? children;
  return (
    <span
      className={cn(
        "inline-block rounded-full px-3 py-1 text-xs font-medium",
        {
          "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20":
            variant === "green",
          "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20":
            variant === "amber",
          "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20":
            variant === "blue",
          "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/10":
            variant === "gray",
          "bg-slate-900 text-white": variant === "dark",
          "bg-blue-100 text-blue-700": variant === "accent",
          "bg-rose-100 text-rose-800": variant === "warning",
        }
      )}
    >
      {content}
    </span>
  );
}