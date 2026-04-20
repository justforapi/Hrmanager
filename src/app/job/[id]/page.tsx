import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import {
  Briefcase,
  MapPin,
  Clock,
  GraduationCap,
  Award,
  Toolbox,
  CheckCircle,
  Star,
  ArrowRight,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PillBadge } from "@/components/ui/PillBadge";
import { BackButton } from "@/components/ui/BackButton";

const DetailItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) =>
  value ? (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  ) : null;

const SkillSection = ({
  title,
  skills,
  icon,
  variant,
}: {
  title: string;
  skills: string[] | null | undefined;
  icon: React.ReactNode;
  variant?: "accent" | "warning" | "dark";
}) =>
  skills && skills.length > 0 ? (
    <div>
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="font-semibold text-gray-700">{title}</h3>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {skills.map((skill) => (
          <PillBadge key={skill} text={skill} variant={variant} />
        ))}
      </div>
    </div>
  ) : null;

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createServerClient();
  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();

  if (!job) {
    notFound();
  }

  return (
    <div className="main-background">
      <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <BackButton fallbackHref="/careers" />
        </div>

        {/* Header */}
        <div className="space-y-3 text-center">
          <p className="font-semibold text-indigo-600">{job.department}</p>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {job.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-gray-500">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{job.location ?? "Not specified"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>{job.employment_type ?? "Full-time"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>
                Posted {new Date(job.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href={`/apply/${job.id}`}>
              Apply Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href={`/create-cv/${job.id}`}>Make CV with AI</Link>
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {job.description && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    About the Role
                  </h2>
                  <div
                    className="prose prose-lg mt-4 max-w-none text-gray-600"
                    dangerouslySetInnerHTML={{
                      __html: job.description.replace(/\n/g, "<br />"),
                    }}
                  />
                </div>
              )}
              {job.requirements && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Requirements
                  </h2>
                  <div
                    className="prose prose-lg mt-4 max-w-none text-gray-600"
                    dangerouslySetInnerHTML={{
                      __html: job.requirements.replace(/\n/g, "<br />"),
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8 lg:col-span-1">
            <div className="rounded-2xl border border-gray-200/80 bg-white/60 p-6 shadow-sm backdrop-blur-lg">
              <h2 className="text-xl font-bold text-gray-900">
                Hiring Details
              </h2>
              <div className="mt-6 space-y-5">
                <DetailItem
                  icon={<Building className="h-5 w-5" />}
                  label="Department"
                  value={job.department}
                />
                <DetailItem
                  icon={<GraduationCap className="h-5 w-5" />}
                  label="Seniority"
                  value={job.seniority_level}
                />
                <DetailItem
                  icon={<Award className="h-5 w-5" />}
                  label="Salary Range"
                  value={job.salary_range}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200/80 bg-white/60 p-6 shadow-sm backdrop-blur-lg">
              <h2 className="text-xl font-bold text-gray-900">
                Skills & Technologies
              </h2>
              <div className="mt-6 space-y-6">
                <SkillSection
                  title="Must-Have Skills"
                  skills={job.must_have_skills}
                  icon={<CheckCircle className="h-5 w-5 text-green-500" />}
                  variant="dark"
                />
                <SkillSection
                  title="Nice-to-Have Skills"
                  skills={job.nice_to_have_skills}
                  icon={<Star className="h-5 w-5 text-amber-500" />}
                  variant="accent"
                />
                <SkillSection
                  title="Tools & Technologies"
                  skills={job.tools_and_tech}
                  icon={<Toolbox className="h-5 w-5 text-blue-500" />}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
