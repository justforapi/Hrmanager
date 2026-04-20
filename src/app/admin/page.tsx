import { createServerClient } from "@/lib/supabase/server";
import { SectionCard } from "@/components/ui/SectionCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Users,
  Briefcase,
  FileText,
  ArrowUpRight,
  User,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";

export const dynamic = "force-dynamic";

const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
}) => (
  <div className="rounded-2xl border border-gray-200/80 bg-white/60 p-6 shadow-sm backdrop-blur-lg">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <div className={`rounded-lg p-2 ${color}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
    </div>
    <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
  </div>
);

export default async function AdminOverviewPage() {
  const supabase = createServerClient();

  const [
    { count: totalApplications },
    { count: openJobsCount },
    { count: shortlistCount },
    { data: recentApplications },
  ] = await Promise.all([
    supabase
      .from("applications")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("jobs")
      .select("id", { count: "exact", head: true })
      .eq("status", "open"),
    supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .eq("status", "shortlisted"),
    supabase
      .from("applications")
      .select("id, full_name, status, created_at, jobs(title)")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Hiring Command Center
        </h1>
        <p className="text-sm text-gray-500">
          Welcome back! Here&apos;s what&apos;s happening with your job
          postings.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard
          title="Total Applications"
          value={totalApplications ?? 0}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Open Jobs"
          value={openJobsCount ?? 0}
          icon={Briefcase}
          color="bg-amber-500"
        />
        <StatCard
          title="Shortlisted"
          value={shortlistCount ?? 0}
          icon={FileText}
          color="bg-green-500"
        />
      </div>

      <SectionCard title="Recent Applications">
        <div className="space-y-3">
          {(recentApplications ?? []).map((app) => {
            const jobRecord = (app as any).jobs;
            const jobTitle = Array.isArray(jobRecord)
              ? jobRecord[0]?.title
              : jobRecord?.title;

            return (
              <div
                key={app.id}
                className="flex flex-col items-start gap-3 rounded-xl p-4 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {app.full_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Applied for {jobTitle ?? "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between sm:w-auto sm:justify-end sm:gap-6">
                  <StatusBadge status={app.status ?? "submitted"} />
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/application/${app.id}`}>
                      View
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
          {(!recentApplications || recentApplications.length === 0) && (
            <div className="flex h-32 flex-col items-center justify-center text-center">
              <p className="text-sm font-medium text-gray-600">
                No recent applications.
              </p>
              <p className="text-xs text-gray-500">
                New applications will appear here.
              </p>
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
