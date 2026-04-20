import { JobsManager } from "@/components/forms/JobsManager";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminJobsPage() {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  return <JobsManager initialJobs={data ?? []} />;
}
