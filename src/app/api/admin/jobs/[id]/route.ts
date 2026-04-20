import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payload = await request.json();
    const supabase = createServerClient();

    const { error } = await supabase
      .from("jobs")
      .update({
        title: payload.title,
        department: payload.department,
        location: payload.location ?? null,
        description: payload.description,
        requirements: payload.requirements,
        employment_type: payload.employment_type ?? null,
        remote_type: payload.remote_type ?? null,
        skills_required: payload.skills_required ?? [],
        preferred_skills: payload.preferred_skills ?? [],
        must_have_skills: payload.must_have_skills ?? [],
        tools_technologies: payload.tools_technologies ?? [],
        certifications: payload.certifications ?? [],
        required_experience_years: payload.required_experience_years ?? null,
        experience_required: payload.experience_required,
        education_level: payload.education_level ?? null,
        seniority_level: payload.seniority_level ?? null,
        skills_weight: payload.skills_weight ?? undefined,
        experience_weight: payload.experience_weight ?? undefined,
        education_weight: payload.education_weight ?? undefined,
        projects_weight: payload.projects_weight ?? undefined,
        communication_weight: payload.communication_weight ?? undefined,
        minimum_score_threshold: payload.minimum_score_threshold ?? undefined,
        auto_shortlist: payload.auto_shortlist ?? false,
        auto_reject: payload.auto_reject ?? false,
        disqualifying_keywords: payload.disqualifying_keywords ?? [],
        screening_questions: payload.screening_questions ?? [],
        salary_min: payload.salary_min ?? null,
        salary_max: payload.salary_max ?? null,
        currency: payload.currency ?? null,
        deadline: payload.deadline ?? null,
        start_date: payload.start_date ?? null,
        questions: payload.questions ?? [],
        status: payload.status ?? "open",
      })
      .eq("id", id);

    if (error) {
      return new NextResponse(error.message, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return new NextResponse(message, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServerClient();

    const { error } = await supabase.from("jobs").delete().eq("id", id);

    if (error) {
      return new NextResponse(error.message, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return new NextResponse(message, { status: 500 });
  }
}
