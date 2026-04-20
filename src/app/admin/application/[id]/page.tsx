import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/send";
import {
  rejectionEmail,
  shortlistEmail,
} from "@/lib/email/templates";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/ui/SectionCard";
import { PillBadge } from "@/components/ui/PillBadge";
import { ScoreCircle } from "@/components/ui/ScoreCircle";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FormSubmitButton } from "@/components/ui/FormSubmitButton";
import {
  FileText,
  Briefcase,
  Phone,
  MapPin,
  Mail,
  User,
} from "lucide-react";

export const dynamic = "force-dynamic";

async function updateStatusAction(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "");
  if (!id || !status) {
    return;
  }

  const supabase = createServerClient();
  const { data: application } = await supabase
    .from("applications")
    .select("full_name, email, ai_missing, ai_improvements, jobs(title)")
    .eq("id", id)
    .single();

  await supabase.from("applications").update({ status }).eq("id", id);

  if (!application) {
    return;
  }

  const jobRecord = (application as any).jobs;
  const jobTitle = Array.isArray(jobRecord)
    ? jobRecord[0]?.title
    : jobRecord?.title;

  if (status === "shortlisted") {
    await sendEmail({
      to: application.email,
      subject: `Your application has been accepted - ${jobTitle ?? "Role"}`,
      html: shortlistEmail({
        candidateName: application.full_name,
        jobTitle: jobTitle ?? "the role",
        companyName: "Helix HR",
      }),
    });
  }

  if (status === "rejected") {
    await sendEmail({
      to: application.email,
      subject: `Update on your application - ${jobTitle ?? "Role"}`,
      html: rejectionEmail({
        candidateName: application.full_name,
        jobTitle: jobTitle ?? "the role",
        companyName: "Helix HR",
        missingSkills: normalizeList(application.ai_missing),
        improvementSuggestions: normalizeList(application.ai_improvements),
      }),
    });
  }

  if (redirectTo) {
    redirect(redirectTo);
  }
}

function normalizeList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).filter(Boolean);
  }
  if (typeof value === "string") {
    try {
      // Try parsing as JSON first
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item)).filter(Boolean);
      }
    } catch (e) {
      // Not a JSON string, treat as comma-separated
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }
  return [];
}

const DetailItem = ({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </div>
    <div className="mt-1 text-sm text-gray-800">{children}</div>
  </div>
);

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createServerClient();
  const { data: application } = await supabase
    .from("applications")
    .select("*, jobs(title, department)")
    .eq("id", id)
    .single();

  if (!application) {
    return (
      <SectionCard title="Not Found">
        <p>Application not found.</p>
      </SectionCard>
    );
  }

  const jobRecord = (application as any).jobs;
  const jobTitle = Array.isArray(jobRecord)
    ? jobRecord[0]?.title
    : jobRecord?.title;
  const jobDepartment = Array.isArray(jobRecord)
    ? jobRecord[0]?.department
    : jobRecord?.department;

  let signedCvUrl: string | null = null;
  if (application.cv_url) {
    const { data } = await supabase.storage
      .from("cvs")
      .createSignedUrl(application.cv_url, 60 * 60);
    signedCvUrl = data?.signedUrl ?? null;
  }

  const aiStrengths = normalizeList(
    application.ai_strengths ?? (application as any).analysis_strengths
  );
  const aiWeaknesses = normalizeList(
    application.ai_weaknesses ?? (application as any).analysis_weaknesses
  );
  const aiMissing = normalizeList(
    application.ai_missing ??
      application.ai_missing_requirements ??
      (application as any).analysis_missing_requirements
  );
  const aiQuestions = normalizeList(application.ai_questions);
  const aiImprovements = normalizeList(application.ai_improvements);
  const aiSummary =
    application.ai_summary ?? (application as any).analysis_summary ?? null;
  const aiScore = application.ai_score ?? (application as any).analysis_score ?? 0;
  const aiDecision = application.ai_decision ?? null;
  const aiDecisionNormalized = String(aiDecision ?? "").toLowerCase();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-gray-200/80 bg-white/60 p-6 shadow-sm backdrop-blur-lg sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {application.full_name}
            </h1>
            <p className="text-sm text-gray-500">{application.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <StatusBadge status={application.status ?? "submitted"} />
          <div className="hidden sm:block">
            <ScoreCircle score={aiScore} />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          <SectionCard title="Application Details">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <DetailItem icon={Briefcase} label="Job Applied">
                <p className="font-semibold">{jobTitle ?? "N/A"}</p>
                <p className="text-xs text-gray-500">
                  {jobDepartment ?? "N/A"}
                </p>
              </DetailItem>
              {application.phone && (
                <DetailItem icon={Phone} label="Phone">
                  {application.phone}
                </DetailItem>
              )}
              {application.location && (
                <DetailItem icon={MapPin} label="Location">
                  {application.location}
                </DetailItem>
              )}
              {signedCvUrl && (
                <DetailItem icon={FileText} label="CV Document">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={signedCvUrl} target="_blank">
                      View CV
                    </Link>
                  </Button>
                </DetailItem>
              )}
            </div>
          </SectionCard>

          {application.answers &&
            Object.keys(application.answers).length > 0 && (
              <SectionCard title="Screening Responses">
                <div className="space-y-4">
                  {Object.entries(application.answers).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        {key}
                      </p>
                      <p className="mt-1 rounded-lg bg-gray-50 p-3 text-gray-800">
                        {String(value)}
                      </p>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}
        </div>

        {/* Right Column (AI Analysis) */}
        <div className="space-y-6 lg:col-span-1">
          <SectionCard title="AI Summary">
            <div className="sm:hidden">
              <ScoreCircle score={application.ai_score} />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:mt-0">
              {aiSummary ?? "No summary available."}
            </p>
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                AI Decision
              </p>
              <PillBadge
                text={aiDecision ?? "N/A"}
                variant={
                  aiDecisionNormalized === "shortlist" ||
                  aiDecisionNormalized === "accepted"
                    ? "green"
                    : aiDecisionNormalized === "reject" ||
                      aiDecisionNormalized === "rejected"
                    ? "warning"
                    : aiDecisionNormalized === "review"
                    ? "amber"
                    : "gray"
                }
              />
            </div>
          </SectionCard>

          {aiStrengths.length > 0 && (
            <SectionCard title="Strengths">
              <div className="flex flex-wrap gap-2">
                {aiStrengths.map((item, i) => (
                  <PillBadge key={i} variant="green" text={item} />
                ))}
              </div>
            </SectionCard>
          )}

          {aiWeaknesses.length > 0 && (
            <SectionCard title="Weaknesses">
              <div className="flex flex-wrap gap-2">
                {aiWeaknesses.map((item, i) => (
                  <PillBadge key={i} variant="amber" text={item} />
                ))}
              </div>
            </SectionCard>
          )}

          {aiMissing.length > 0 && (
            <SectionCard title="Missing Requirements">
              <div className="flex flex-wrap gap-2">
                {aiMissing.map((item, i) => (
                  <PillBadge key={i} variant="gray" text={item} />
                ))}
              </div>
            </SectionCard>
          )}
        </div>
      </div>

      {/* Full Width Sections */}
      <div className="space-y-6">
        {aiQuestions.length > 0 && (
          <SectionCard title="Suggested Interview Questions">
            <ul className="space-y-3">
              {aiQuestions.map((item, i) => (
                <li key={i} className="rounded-lg bg-gray-50 p-3">
                  {item}
                </li>
              ))}
            </ul>
          </SectionCard>
        )}

        {aiImprovements.length > 0 && (
          <SectionCard title="Candidate Improvement Suggestions">
            <ul className="space-y-3">
              {aiImprovements.map((item, i) => (
                <li key={i} className="rounded-lg bg-gray-50 p-3">
                  {item}
                </li>
              ))}
            </ul>
          </SectionCard>
        )}

        <SectionCard title="Actions">
          <div className="flex flex-wrap gap-3">
            <form action={updateStatusAction}>
              <input type="hidden" name="id" value={application.id} />
              <input type="hidden" name="status" value="reviewed" />
              <input
                type="hidden"
                name="redirectTo"
                value={`/admin/application/${application.id}`}
              />
              <FormSubmitButton variant="outline" pendingText="Marking...">
                Mark as Reviewed
              </FormSubmitButton>
            </form>
            <form action={updateStatusAction}>
              <input type="hidden" name="id" value={application.id} />
              <input type="hidden" name="status" value="shortlisted" />
              <input
                type="hidden"
                name="redirectTo"
                value={`/admin/application/${application.id}`}
              />
              <FormSubmitButton
                pendingText="Shortlisting..."
                className="bg-green-600 text-white hover:bg-green-500"
              >
                Shortlist Candidate
              </FormSubmitButton>
            </form>
            <form action={updateStatusAction}>
              <input type="hidden" name="id" value={application.id} />
              <input type="hidden" name="status" value="rejected" />
              <input
                type="hidden"
                name="redirectTo"
                value={`/admin/application/${application.id}`}
              />
              <FormSubmitButton variant="destructive" pendingText="Rejecting...">
                Reject
              </FormSubmitButton>
            </form>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
