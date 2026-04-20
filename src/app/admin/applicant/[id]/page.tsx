import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import {
  User,
  Mail,
  Briefcase,
  GraduationCap,
  FileText,
  Download,
} from "lucide-react";
import { SectionCard } from "@/components/ui/SectionCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ScoreCircle } from "@/components/ui/ScoreCircle";
import { PillBadge } from "@/components/ui/PillBadge";
import { ApplicantDetailActions } from "@/components/forms/ApplicantDetailActions";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/BackButton";

export const dynamic = "force-dynamic";

function resolvePhotoUrl(photoUrl: string | null, supabase: ReturnType<typeof createServerClient>) {
  if (!photoUrl) return null;
  if (photoUrl.startsWith("http")) return photoUrl;
  const { data } = supabase.storage.from("candidate-photos").getPublicUrl(photoUrl);
  return data.publicUrl;
}

const DetailItem = ({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <div className="flex items-center gap-2">
      {icon}
      <h3 className="font-semibold text-gray-700">{label}</h3>
    </div>
    <div className="mt-2 pl-8 text-gray-600">{children}</div>
  </div>
);

export default async function ApplicantDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServerClient();
  const { data: applicant } = await supabase
    .from("applicants")
    .select("*, jobs(title, department)")
    .eq("id", params.id)
    .single();

  if (!applicant) {
    notFound();
  }

  const jobRecord = applicant.jobs as { title: string; department: string };
  const resolvedPhotoUrl = resolvePhotoUrl(applicant.photo_url, supabase);

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <BackButton fallbackHref="/admin/applicants" />
      </div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          {resolvedPhotoUrl ? (
            <img
              src={resolvedPhotoUrl}
              alt={applicant.name}
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200">
              <User className="h-12 w-12 text-gray-500" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {applicant.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-500">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${applicant.email}`} className="hover:underline">
                  {applicant.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                <span>
                  Applying for{" "}
                  <span className="font-medium text-gray-700">
                    {jobRecord?.title ?? "N/A"}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <StatusBadge status={applicant.status} />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-8 lg:col-span-2">
          {applicant.ai_analysis && (
            <SectionCard title="AI Analysis">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Overall Recommendation
                  </h3>
                  <p className="mt-2 text-gray-600">
                    {
                      (applicant.ai_analysis as any)?.summary ??
                      "No summary available."
                    }
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center rounded-xl bg-gray-50 p-4">
                  <ScoreCircle score={applicant.ai_score ?? 0} />
                  <p className="mt-2 text-sm font-medium text-gray-600">
                    Compatibility Score
                  </p>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800">Strengths</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(
                      (applicant.ai_analysis as any)?.strengths ?? []
                    ).map((s: string) => (
                      <PillBadge key={s} text={s} />
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    Potential Weaknesses
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(
                      (applicant.ai_analysis as any)?.weaknesses ?? []
                    ).map((w: string) => (
                      <PillBadge key={w} text={w} variant="warning" />
                    ))}
                  </div>
                </div>
              </div>
            </SectionCard>
          )}

          {applicant.answers && (
            <SectionCard title="Screening Responses">
              <div className="space-y-4">
                {Object.entries(applicant.answers).map(([key, value]) => (
                  <div key={key}>
                    <p className="font-medium text-gray-800">{key}</p>
                    <p className="mt-1 text-gray-600">{String(value)}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <SectionCard title="Actions">
            <ApplicantDetailActions applicantId={applicant.id} />
          </SectionCard>
          <SectionCard title="Applicant Details">
            <div className="space-y-6">
              <DetailItem icon={<Briefcase className="h-5 w-5 text-gray-400" />} label="Job">
                <p className="font-medium text-gray-800">{jobRecord?.title}</p>
                <p className="text-sm text-gray-500">{jobRecord?.department}</p>
              </DetailItem>
              <DetailItem icon={<FileText className="h-5 w-5 text-gray-400" />} label="CV/Resume">
                <Button variant="outline" asChild>
                  <a href={applicant.cv_url} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    Download CV
                  </a>
                </Button>
              </DetailItem>
              {applicant.education && (
                <DetailItem icon={<GraduationCap className="h-5 w-5 text-gray-400" />} label="Education">
                  <p>{applicant.education}</p>
                </DetailItem>
              )}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
