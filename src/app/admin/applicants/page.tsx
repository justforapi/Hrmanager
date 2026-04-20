import { ApplicantsTable } from "@/components/forms/ApplicantsTable";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function resolvePhotoUrl(photoUrl: string | null, supabase: ReturnType<typeof createServerClient>) {
  if (!photoUrl) return null;
  if (photoUrl.startsWith("http")) return photoUrl;
  const { data } = supabase.storage.from("candidate-photos").getPublicUrl(photoUrl);
  return data.publicUrl;
}

export default async function AdminApplicantsPage() {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("applicants")
    .select("id, name, email, photo_url, ai_score, status, created_at, jobs(title)")
    .order("ai_score", { ascending: false });

  const applicants = (data ?? []).map((applicant) => {
    const jobRecord = (applicant as any).jobs;
    const jobTitle = Array.isArray(jobRecord)
      ? jobRecord[0]?.title
      : jobRecord?.title;

    return {
      id: applicant.id,
      name: applicant.name,
      email: applicant.email,
      photoUrl: resolvePhotoUrl(applicant.photo_url, supabase),
      jobTitle: jobTitle ?? "Unknown",
      ai_score: applicant.ai_score,
      status: applicant.status,
      created_at: applicant.created_at,
    };
  });

  return <ApplicantsTable applicants={applicants} />;
}
