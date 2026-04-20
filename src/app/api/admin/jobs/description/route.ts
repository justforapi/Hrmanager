import { NextResponse } from "next/server";

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY ?? "";
    if (!apiKey) {
      return new NextResponse("Missing GROQ_API_KEY", { status: 500 });
    }

    const payload = await request.json();
    const prompt = `Write a professional job description in 2-3 short paragraphs (120-160 words). Keep it concise but not too short. No bullet lists and no emojis. Include the role summary and key responsibilities.\n\nRole details:\nTitle: ${payload.title || ""}\nDepartment: ${payload.department || ""}\nLocation: ${payload.location || ""}\nEmployment type: ${payload.employment_type || ""}\nRemote type: ${payload.remote_type || ""}\nSeniority: ${payload.seniority_level || ""}\nRequirements: ${payload.requirements || ""}\nSalary range: ${payload.salary_min || ""}-${payload.salary_max || ""} ${payload.currency || ""}`;

    const basePayload = {
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content:
            "You are an HR recruiter. Write a concise, professional job description. Return plain text only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    };

    const response = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        ...basePayload,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new NextResponse(`Groq error (${response.status}): ${errorText}`, {
        status: 500,
      });
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content?.trim() ?? "";

    if (!text) {
      return new NextResponse("Groq returned empty content", { status: 500 });
    }

    return NextResponse.json({ description: text });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    return new NextResponse(message, { status: 500 });
  }
}
