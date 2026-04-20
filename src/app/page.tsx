import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Bot,
  Briefcase,
  CheckCircle,
  LineChart,
  Shield,
  Users,
  Zap,
} from "lucide-react";

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="rounded-2xl border border-gray-200/80 bg-white/60 p-6 shadow-sm backdrop-blur-lg">
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500 text-white">
      {icon}
    </div>
    <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
    <p className="mt-2 text-sm text-gray-600">{description}</p>
  </div>
);

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl border border-gray-200/80 bg-white/70 p-5 text-left shadow-sm">
    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
      {label}
    </p>
    <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
  </div>
);

const StepItem = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="flex gap-4">
    <div className="mt-1 h-9 w-9 flex-none rounded-xl bg-indigo-50 text-indigo-600">
      <div className="flex h-full w-full items-center justify-center">
        <CheckCircle className="h-5 w-5" />
      </div>
    </div>
    <div>
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{description}</p>
    </div>
  </div>
);

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col main-background">
      <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-900 text-white">
              <Bot size={20} />
            </div>
            <span className="text-xl font-semibold text-gray-900">Helix HR</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/careers">Careers</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-14 sm:py-20 lg:py-24">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-indigo-600">
                <Zap className="h-4 w-4" />
                AI-Driven Hiring Operations
              </div>
              <h1 className="mt-5 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Hire with confidence from the first screen to the final offer.
              </h1>
              <p className="mt-5 text-base leading-relaxed text-gray-600 sm:text-lg">
                Helix HR unifies career listings, applicant scoring, and team
                workflows in one workspace. Shortlist faster, stay compliant,
                and give every candidate a consistent experience.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <Button size="lg" asChild>
                  <Link href="/careers">
                    Explore Open Roles <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/create-cv">Make CV with AI</Link>
                </Button>
              </div>
              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <StatCard label="Time to shortlist" value="2.4x faster" />
                <StatCard label="Candidate updates" value="Automated" />
                <StatCard label="Hiring visibility" value="Team-wide" />
              </div>
            </div>
            <div className="rounded-3xl border border-gray-200/80 bg-white/70 p-6 shadow-lg backdrop-blur-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Live Pipeline
                  </p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    Product Designer - Growth
                  </p>
                </div>
                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  18 active
                </span>
              </div>
              <div className="mt-5 space-y-4">
                {[
                  {
                    label: "Screened",
                    count: "42",
                    tone: "bg-indigo-100 text-indigo-700",
                  },
                  {
                    label: "Shortlisted",
                    count: "12",
                    tone: "bg-green-100 text-green-700",
                  },
                  {
                    label: "Interview",
                    count: "6",
                    tone: "bg-amber-100 text-amber-700",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-2xl border border-gray-200/70 bg-white px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {item.label}
                      </p>
                      <p className="text-xs text-gray-500">Updated today</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${item.tone}`}
                    >
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Highlights */}
        <section className="py-14 sm:py-20">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-3xl border border-gray-200/80 bg-white/70 p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                  <Shield className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  Structured, compliant hiring
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Standardize scorecards, keep timelines documented, and
                  centralize every hiring decision with audit-ready history.
                </p>
              </div>
              <div className="rounded-3xl border border-gray-200/80 bg-white/70 p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <LineChart className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  Actionable hiring insights
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Track pipeline health, source performance, and conversion
                  metrics in real time to improve every role launch.
                </p>
              </div>
              <div className="rounded-3xl border border-gray-200/80 bg-white/70 p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  Team-first collaboration
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Give recruiters, managers, and executives a shared view of
                  every candidate, every interview, and every next step.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-14 sm:py-20">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <div className="text-left sm:text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                A recruitment workflow designed for clarity.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600 sm:text-lg">
                Build consistent hiring processes with clear responsibilities,
                candidate communications, and AI-supported screening.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              <FeatureCard
                icon={<Briefcase size={24} />}
                title="Centralized Job Board"
                description="Manage all your job listings from a single dashboard and publish them to a public, branded careers page."
              />
              <FeatureCard
                icon={<Bot size={24} />}
                title="AI-Assisted Screening"
                description="AI scoring highlights skills, gaps, and fit so hiring teams can focus on the highest potential candidates."
              />
              <FeatureCard
                icon={<Zap size={24} />}
                title="Automated Workflows"
                description="Move candidates through your pipeline with automated status updates, emails, and next-step reminders."
              />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-14 sm:py-20">
          <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                How it works
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                A modern hiring loop with clear ownership.
              </h2>
              <p className="mt-4 text-base text-gray-600">
                Designed for recruiting teams that need speed without losing
                accountability. Every role has a plan, every candidate has a
                timeline, and every decision is measurable.
              </p>
            </div>
            <div className="space-y-6">
              <StepItem
                title="Launch a role with structured intake"
                description="Define requirements, align on must-have skills, and publish instantly to the careers page."
              />
              <StepItem
                title="Screen candidates with AI insights"
                description="Automated scoring, missing skills, and improvement notes help teams focus on the right profiles."
              />
              <StepItem
                title="Coordinate interviews in one workspace"
                description="Track status, capture feedback, and trigger updates without losing momentum."
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 sm:py-20">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <div className="rounded-3xl border border-gray-200/80 bg-white/80 p-8 text-left shadow-lg sm:p-12">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Ready to elevate your hiring operations?
                  </h2>
                  <p className="mt-3 max-w-2xl text-base text-gray-600">
                    Launch roles, evaluate applicants, and move faster with
                    intelligent workflows built for modern teams.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button size="lg" asChild>
                    <Link href="/careers">
                      View Open Roles <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/create-cv">Create a CV</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-gray-200/80 bg-white/80 py-8 backdrop-blur-lg">
        <div className="mx-auto w-full max-w-7xl px-4 text-center text-gray-500 sm:px-6">
          <p>&copy; {new Date().getFullYear()} Helix HR. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
