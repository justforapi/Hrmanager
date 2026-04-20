import { cn } from "@/lib/utils";

type SectionCardProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export function SectionCard({ title, children, className }: SectionCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md",
        className
      )}
    >
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
        {title}
      </h2>
      <div className="text-sm text-gray-700">{children}</div>
    </div>
  );
}