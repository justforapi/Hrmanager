import { Skeleton } from "@/components/ui/skeleton";

export default function CareersLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-full sm:w-96" />
        <Skeleton className="h-5 w-full sm:w-72" />
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-48" />
          ))}
        </div>
      </div>
    </div>
  );
}
