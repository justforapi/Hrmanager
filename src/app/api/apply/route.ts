import { NextResponse } from "next/server";

import { analyzeCandidate } from "@/lib/groq/client";
import { applicationReceivedEmail, rejectionEmail, shortlistEmail } from "@/lib/email/templates";
import { sendEmail } from "@/lib/email/send";
import { extractPdfText } from "@/lib/pdf/parse";
import { createServerClient } from "@/lib/supabase/server";
import { uploadToBucket } from "@/lib/supabase/storage";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const jobId = String(formData.get("jobId") ?? "");
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const phone = String(formData.get("phone") ?? "") || null;
    const salaryExpectationValue = formData.get("salary_expectation");
    const salaryCurrency = String(formData.get("salary_currency") ?? "").trim();
    const cvFile = formData.get("cv") as File | null;
    const photoFile = formData.get("photo") as File | null;

    if (!jobId || !name || !email || !cvFile) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const salaryExpectation = salaryExpectationValue
      ? Number(salaryExpectationValue)
      : null;
    const normalizedSalaryExpectation = Number.isNaN(salaryExpectation)
      ? null
      : salaryExpectation;

    const answers: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("question:")) {
        const question = key.replace("question:", "");
        answers[question] = String(value ?? "");
      }
    }

    const supabase = createServerClient();
    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", jobId)
      .single();

    if (jobError || !job) {
      return new NextResponse("Job not found", { status: 404 });
    }

    const cvPath = `${jobId}/${Date.now()}-${cvFile.name}`;
    const cvUrl = await uploadToBucket({
      bucket: "cv-uploads",
      path: cvPath,
      file: cvFile,
    });

    let photoUrl: string | null = null;
    if (photoFile && photoFile.size > 0) {
      const photoPath = `${jobId}/${Date.now()}-${photoFile.name}`;
      photoUrl = await uploadToBucket({
        bucket: "candidate-photos",
        path: photoPath,
        file: photoFile,
      });
    }

    const cvBuffer = Buffer.from(await cvFile.arrayBuffer());
    const cvText = await extractPdfText(cvBuffer);

    const analysis = await analyzeCandidate({
      job: {
        title: job.title,
        description: job.description,
        requirements: job.requirements,
        seniority_level: job.seniority_level ?? null,
        screening_questions: job.screening_questions ?? [],
      },
      candidate: {
        name,
        cvText,
        answers,
      },
    });

    const threshold = job.minimum_score_threshold ?? 0;
    let status: "new" | "shortlisted" | "rejected" = "new";
    if (job.auto_shortlist && analysis.score >= threshold) {
      status = "shortlisted";
    } else if (job.auto_reject && analysis.score < threshold) {
      status = "rejected";
    }

    const { data: applicant, error: insertError } = await supabase
      .from("applicants")
      .insert({
        name,
        email,
        phone,
        job_id: jobId,
        cv_url: cvUrl,
        photo_url: photoUrl,
        answers,
        salary_expectation: normalizedSalaryExpectation,
        salary_currency: salaryCurrency || null,
        ai_score: analysis.score,
        ai_summary: analysis.summary,
        ai_strengths: analysis.strengths,
        ai_weaknesses: analysis.weaknesses,
        ai_decision: analysis.decision,
        ai_missing_requirements: analysis.missing_requirements,
        ai_questions: analysis.interview_questions,
        ai_improvements: analysis.improvement_suggestions,
        status,
      })
      .select("id")
      .single();

    if (insertError) {
      return new NextResponse(insertError.message, { status: 500 });
    }

    await sendEmail({
      to: email,
      subject: `Application received - ${job.title}`,
      html: applicationReceivedEmail({
        candidateName: name,
        jobTitle: job.title,
        companyName: "Helix HR",
      }),
    });

    if (status === "shortlisted") {
      await sendEmail({
        to: email,
        subject: `Your application has been accepted - ${job.title}`,
        html: shortlistEmail({
          candidateName: name,
          jobTitle: job.title,
          companyName: "Helix HR",
        }),
      });
    }

    if (status === "rejected") {
      await sendEmail({
        to: email,
        subject: `Update on your application - ${job.title}`,
        html: rejectionEmail({
          candidateName: name,
          jobTitle: job.title,
          companyName: "Helix HR",
          missingSkills: analysis.missing_requirements,
          improvementSuggestions: analysis.improvement_suggestions,
        }),
      });
    }

    return NextResponse.json({ id: applicant.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return new NextResponse(message, { status: 500 });
  }
}
