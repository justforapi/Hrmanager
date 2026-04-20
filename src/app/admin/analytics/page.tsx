import { createServerClient } from "@/lib/supabase/server";
import { SectionCard } from "@/components/ui/SectionCard";
import { ScoreCircle } from "@/components/ui/ScoreCircle";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { BarChart, Users, Star } from "lucide-react";

export const dynamic = "force-dynamic";

const StatCard = ({
  title,
  value,
  icon,
  description,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
}) => (
  <div className="rounded-2xl border border-gray-200/80 bg-white/60 p-6 shadow-sm backdrop-blur-lg">
    <div className="flex items-center justify-between">
      <h3 className="text-base font-semibold text-gray-600">{title}</h3>
      {icon}
    </div>
    <p className="mt-4 text-3xl font-bold text-gray-900">{value}</p>
    {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
  </div>
);

export default async function AnalyticsPage() {
  const supabase = createServerClient();
  const { data: applicants, error } = await supabase
    .from("applicants")
    .select("ai_score, status");

  if (error) {
    return (
      <SectionCard title="Error">
        <p>Could not load analytics data.</p>
      </SectionCard>
    );
  }

  const scores = (applicants ?? []).map((item) => item.ai_score).filter(Boolean);
  const averageScore =
    scores.length > 0
      ? Math.round(
          scores.reduce((sum, score) => sum + (score ?? 0), 0) / scores.length
        )
      : 0;

  const totalApplicants = applicants?.length ?? 0;

  const statusCounts = (applicants ?? []).reduce<Record<string, number>>(
    (acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Talent Pipeline Analytics
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          An overview of your candidate data and hiring funnel.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard
          title="Total Applicants"
          value={totalApplicants}
          icon={<Users className="h-6 w-6 text-gray-400" />}
        />
        <StatCard
          title="Average AI Score"
          value={averageScore}
          icon={<Star className="h-6 w-6 text-gray-400" />}
          description="Across all candidates"
        />
        <StatCard
          title="Shortlisted"
          value={statusCounts.shortlisted ?? 0}
          icon={<Users className="h-6 w-6 text-gray-400" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <SectionCard title="Application Funnel">
          <div className="space-y-4">
            {Object.entries(statusCounts).length > 0 ? (
              Object.entries(statusCounts).map(([status, count]) => (
                <div
                  key={status}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <StatusBadge status={status} />
                    <span className="font-medium capitalize text-gray-700">
                      {status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-gray-800">{count}</span>
                    <div className="h-2 w-32 rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-indigo-500"
                        style={{
                          width: `${(count / totalApplicants) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No applicant data yet.</p>
            )}
          </div>
        </SectionCard>
        <SectionCard title="Score Distribution">
          <div className="flex h-64 items-center justify-center">
            <p className="text-gray-500">
              Chart component coming soon.
            </p>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
