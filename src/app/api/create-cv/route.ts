import { NextResponse } from "next/server";

import { analyzeCandidate, generateCvDraft } from "@/lib/groq/client";
import { applicationReceivedEmail, rejectionEmail, shortlistEmail } from "@/lib/email/templates";
import { sendEmail } from "@/lib/email/send";
import { generateCvPdf } from "@/lib/pdf/generate";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const jobId = String(formData.get("jobId") ?? "");
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const education = String(formData.get("education") ?? "");
    const skills = String(formData.get("skills") ?? "");
    const experience = String(formData.get("experience") ?? "");
    const projects = String(formData.get("projects") ?? "");
    const salaryExpectationValue = formData.get("salary_expectation");
    const salaryCurrency = String(formData.get("salary_currency") ?? "").trim();
    const photoFile = formData.get("photo") as File | null;

    if (!jobId || !name || !email) {
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

    const cvDraft = await generateCvDraft({
      name,
      email,
      education,
      skills,
      experience,
      projects,
      jobTitle: job.title,
      jobDescription: job.description,
    });

    const pdfBuffer = await generateCvPdf(cvDraft);
    const applicationId = crypto.randomUUID();
    const cvPath = `${jobId}/${applicationId}.pdf`;
    const { error: uploadError } = await supabase.storage
      .from("cvs")
      .upload(cvPath, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      return new NextResponse(uploadError.message, { status: 500 });
    }

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
        cvText: cvDraft,
        answers,
      },
    });

    const { data: application, error: insertError } = await supabase
      .from("applications")
      .insert({
        id: applicationId,
        job_id: jobId,
        full_name: name,
        email,
        phone: null,
        location: null,
        cv_url: cvPath,
        cv_text: cvDraft,
        answers,
        salary_expectation: normalizedSalaryExpectation,
        salary_currency: salaryCurrency || null,
        ai_score: analysis.score,
        ai_decision: analysis.decision,
        ai_summary: analysis.summary,
        ai_strengths: analysis.strengths,
        ai_weaknesses: analysis.weaknesses,
        ai_missing: analysis.missing_requirements,
        ai_questions: analysis.interview_questions,
        ai_improvements: analysis.improvement_suggestions,
        status: "submitted",
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

    if (analysis.decision === "shortlist") {
      await sendEmail({
        to: email,
        subject: `Next steps - ${job.title}`,
        html: shortlistEmail({
          candidateName: name,
          jobTitle: job.title,
          companyName: "Helix HR",
        }),
      });
    }

    if (analysis.decision === "reject") {
      await sendEmail({
        to: email,
        subject: `Application update - ${job.title}`,
        html: rejectionEmail({
          candidateName: name,
          jobTitle: job.title,
          companyName: "Helix HR",
          missingSkills: analysis.missing_requirements,
          improvementSuggestions: analysis.improvement_suggestions,
        }),
      });
    }

    return NextResponse.json({ id: application.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return new NextResponse(message, { status: 500 });
  }
}
