import { CareersList } from "@/components/forms/CareersList";
import { createServerClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/dashboard/EmptyState";

export const dynamic = "force-dynamic";

export default async function CareersPage() {
  const supabase = createServerClient();
  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .eq("status", "open")
    .order("created_at", { ascending: false });

  return (
    <div className="main-background">
      <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Find Your Next Opportunity
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600 sm:mt-6 sm:text-lg">
            We&apos;re looking for passionate people to join our team. Explore our
            open roles and find where you fit in.
          </p>
        </div>

        <div className="mt-10 sm:mt-16">
          {jobs && jobs.length > 0 ? (
            <CareersList jobs={jobs} />
          ) : (
            <EmptyState
              title="No Open Roles"
              description="There are currently no open positions. Please check back later."
            />
          )}
        </div>
      </div>
    </div>
  );
}
