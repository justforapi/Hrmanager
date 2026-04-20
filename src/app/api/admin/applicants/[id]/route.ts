import { NextResponse, type NextRequest } from "next/server";

import { createServerClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/send";
import { rejectionEmail, shortlistEmail } from "@/lib/email/templates";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payload = await request.json();
    const supabase = createServerClient();

    const { data: applicant, error: applicantError } = await supabase
      .from("applicants")
      .select("*, jobs(title)")
      .eq("id", id)
      .single();

    if (applicantError || !applicant) {
      return new NextResponse("Applicant not found", { status: 404 });
    }

    const { error } = await supabase
      .from("applicants")
      .update({ status: payload.status })
      .eq("id", id);

    if (error) {
      return new NextResponse(error.message, { status: 500 });
    }

    const jobRecord = (applicant as any).jobs;
    const jobTitle = Array.isArray(jobRecord) ? jobRecord[0]?.title : jobRecord?.title;

    if (payload.status === "shortlisted") {
      await sendEmail({
        to: applicant.email,
        subject: `Next steps - ${jobTitle ?? "Application"}`,
        html: shortlistEmail({
          candidateName: applicant.name,
          jobTitle: jobTitle ?? "your role",
          companyName: "Helix HR",
        }),
      });
    }

    if (payload.status === "rejected") {
      await sendEmail({
        to: applicant.email,
        subject: `Application update - ${jobTitle ?? "Role"}`,
        html: rejectionEmail({
          candidateName: applicant.name,
          jobTitle: jobTitle ?? "your role",
          companyName: "Helix HR",
          reason: payload.reason,
          missingSkills: payload.missingSkills,
          improvementSuggestions: payload.improvementSuggestions,
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return new NextResponse(message, { status: 500 });
  }
}
