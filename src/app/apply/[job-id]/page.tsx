import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { ApplyForm } from "@/components/forms/ApplyForm";
import { analyzeCandidate } from "@/lib/groq/client";
import {
  applicationReceivedEmail,
  rejectionEmail,
  shortlistEmail,
} from "@/lib/email/templates";
import { sendEmail } from "@/lib/email/send";
import { extractPdfText } from "@/lib/pdf/parse";
import { createServerClient } from "@/lib/supabase/server";
import { Briefcase, MapPin } from "lucide-react";
import { BackButton } from "@/components/ui/BackButton";

export const dynamic = "force-dynamic";

type ApplyState = {
  error?: string | null;
};

export default async function ApplyPage({
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
    notFound();
  }

  async function applyAction(
    _prevState: ApplyState,
    formData: FormData
  ): Promise<ApplyState> {
    "use server";
    try {
      const jobId = String(formData.get("jobId") ?? "");
      const fullName = String(formData.get("full_name") ?? "");
      const email = String(formData.get("email") ?? "");
      const phone = String(formData.get("phone") ?? "") || null;
      const location = String(formData.get("location") ?? "") || null;
      const cvFile = formData.get("cv") as File | null;
      const photoFile = formData.get("photo") as File | null;

      if (!jobId || !fullName || !email || !cvFile) {
        return { error: "Missing required fields." };
      }

      if (cvFile.type !== "application/pdf") {
        return { error: "Please upload a PDF CV." };
      }

      const answers: Record<string, string> = {};
      for (const [key, value] of formData.entries()) {
        if (key.startsWith("question:")) {
          const question = key.replace("question:", "");
          answers[question] = String(value ?? "");
        }
      }

      const applicationId = crypto.randomUUID();
      const path = `${jobId}/${applicationId}.pdf`;

      const supabaseServer = createServerClient();
      const arrayBuffer = await cvFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { error: uploadError } = await supabaseServer.storage
        .from("cvs")
        .upload(path, buffer, {
          contentType: cvFile.type,
          upsert: true,
        });

      if (uploadError) {
        return { error: uploadError.message };
      }

      const cvText = await extractPdfText(buffer);

      const { data: jobData, error: jobError } = await supabaseServer
        .from("jobs")
        .select(
          "id, title, description, requirements, seniority_level, screening_questions, minimum_score_threshold, auto_shortlist, auto_reject"
        )
        .eq("id", jobId)
        .single();

      if (jobError || !jobData) {
        return { error: "Job not found." };
      }

      const analysis = await analyzeCandidate({
        job: {
          title: jobData.title,
          description: jobData.description,
          requirements: jobData.requirements,
          seniority_level: jobData.seniority_level ?? null,
          screening_questions: jobData.screening_questions ?? [],
        },
        candidate: {
          name: fullName,
          cvText: cvText,
          answers: answers,
        },
      });

      const { data: cvPublic } = supabaseServer.storage
        .from("cvs")
        .getPublicUrl(path);

      let photoUrl: string | null = null;
      if (photoFile && photoFile.size > 0) {
        const photoPath = `${jobId}/${applicationId}-${photoFile.name}`;
        const photoArrayBuffer = await photoFile.arrayBuffer();
        const photoBuffer = Buffer.from(photoArrayBuffer);
        const { error: photoUploadError } = await supabaseServer.storage
          .from("candidate-photos")
          .upload(photoPath, photoBuffer, {
            contentType: photoFile.type,
            upsert: true,
          });

        if (photoUploadError) {
          return { error: photoUploadError.message };
        }

        const { data: photoPublic } = supabaseServer.storage
          .from("candidate-photos")
          .getPublicUrl(photoPath);
        photoUrl = photoPublic.publicUrl ?? null;
      }

      const threshold = jobData.minimum_score_threshold ?? 0;
      let applicantStatus: "new" | "shortlisted" | "rejected" = "new";
      if (jobData.auto_shortlist && analysis.score >= threshold) {
        applicantStatus = "shortlisted";
      } else if (jobData.auto_reject && analysis.score < threshold) {
        applicantStatus = "rejected";
      }

      const { error: insertError } = await supabaseServer
        .from("applications")
        .insert({
          id: applicationId,
          job_id: jobId,
          full_name: fullName,
          email,
          phone,
          location,
          cv_path: path,
          screening_answers: answers,
          analysis_score: analysis.score,
          analysis_summary: analysis.summary,
          analysis_strengths: analysis.strengths,
          analysis_weaknesses: analysis.weaknesses,
          status: analysis.score > 75 ? "shortlisted" : "received",
        });

      if (insertError) {
        return { error: insertError.message };
      }

      const { error: applicantInsertError } = await supabaseServer
        .from("applicants")
        .insert({
          name: fullName,
          email,
          phone,
          job_id: jobId,
          cv_url: cvPublic.publicUrl,
          photo_url: photoUrl,
          answers,
          ai_score: analysis.score,
          ai_summary: analysis.summary,
          ai_strengths: analysis.strengths,
          ai_weaknesses: analysis.weaknesses,
          ai_decision: analysis.decision,
          ai_missing_requirements: analysis.missing_requirements,
          ai_questions: analysis.interview_questions,
          ai_improvements: analysis.improvement_suggestions,
          status: applicantStatus,
        });

      if (applicantInsertError) {
        return { error: applicantInsertError.message };
      }

      await sendEmail({
        to: email,
        subject: "We've Received Your Application!",
        html: applicationReceivedEmail({
          candidateName: fullName,
          jobTitle: jobData.title,
          companyName: "Helix HR",
        }),
      });

      if (applicantStatus === "shortlisted") {
        await sendEmail({
          to: email,
          subject: "Your Application Has Been Accepted",
          html: shortlistEmail({
            candidateName: fullName,
            jobTitle: jobData.title,
            companyName: "Helix HR",
          }),
        });
      }

      if (applicantStatus === "rejected") {
        await sendEmail({
          to: email,
          subject: "Update on Your Application",
          html: rejectionEmail({
            candidateName: fullName,
            jobTitle: jobData.title,
            companyName: "Helix HR",
            missingSkills: analysis.missing_requirements,
            improvementSuggestions: analysis.improvement_suggestions,
          }),
        });
      }
    } catch (e: any) {
      return { error: e.message };
    }

    redirect(`/apply/${jobId}/success`);
  }

  return (
    <div className="main-background">
      <div className="mx-auto w-full max-w-3xl px-4 py-24">
        <div className="mb-8">
          <BackButton fallbackHref={`/job/${job.id}`} />
        </div>
        <div className="space-y-2 text-center">
          <p className="font-semibold text-indigo-600">Apply Now</p>
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
              <span>{job.department ?? "N/A"}</span>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <ApplyForm
            jobId={job.id}
            questions={job.screening_questions ?? []}
            action={applyAction}
          />
        </div>
      </div>
    </div>
  );
}
