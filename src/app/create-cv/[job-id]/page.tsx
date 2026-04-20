import { CreateCvForm } from "@/components/forms/CreateCvForm";
import { Badge } from "@/components/ui/badge";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function CreateCvPage({
  params,
}: {
  params: Promise<{ "job-id": string }>;
}) {
  const { "job-id": jobId } = await params;
  const supabase = createServerClient();
  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .single();

  if (!job) {
    return <p className="text-sm text-slate-500">Job not found.</p>;
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="space-y-3">
        <Badge variant="accent">AI CV Builder</Badge>
        <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
          Create a tailored CV for {job.title}
        </h1>
        <p className="text-slate-600">
          Provide your background and we will generate a polished CV aligned to the
          role requirements.
        </p>
      </div>

      <div className="mt-8">
        <CreateCvForm
          jobId={job.id}
          questions={job.screening_questions ?? job.questions ?? []}
        />
      </div>
    </div>
  );
}
