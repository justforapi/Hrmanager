import { ApplicationsTable } from "@/components/forms/ApplicationsTable";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminApplicationsPage() {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("applications")
    .select("id, full_name, email, ai_score, ai_decision, status, created_at, jobs(title)")
    .order("created_at", { ascending: false });

  const applications = (data ?? []).map((application) => {
    const jobRecord = (application as any).jobs;
    const jobTitle = Array.isArray(jobRecord)
      ? jobRecord[0]?.title
      : jobRecord?.title;

    return {
      id: application.id,
      full_name: application.full_name,
      email: application.email,
      ai_score: application.ai_score,
      ai_decision: application.ai_decision,
      status: application.status,
      created_at: application.created_at,
      jobTitle: jobTitle ?? "Unknown",
    };
  });

  return <ApplicationsTable applications={applications} />;
}
