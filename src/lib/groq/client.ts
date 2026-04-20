const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

const SYSTEM_ANALYSIS_PROMPT =
  "You are an HR analyst. Return only strict JSON with the required schema. No prose.";

const SYSTEM_CV_PROMPT =
  "You are a professional recruiter. Generate a concise, ATS-friendly CV draft. Return plain text only.";

type AnalysisPayload = {
  job: {
    title: string;
    description: string;
    requirements: string;
    seniority_level?: string | null;
    screening_questions?: string[] | null;
  };
  candidate: {
    name: string;
    cvText: string;
    answers: Record<string, string> | null;
  };
};

export type GroqAnalysis = {
  score: number;
  decision: "shortlist" | "review" | "reject";
  summary: string;
  strengths: string[];
  weaknesses: string[];
  missing_requirements: string[];
  interview_questions: string[];
  improvement_suggestions: string[];
};

function safeJsonParse(input: string) {
  try {
    return JSON.parse(input);
  } catch {
    const start = input.indexOf("{");
    const end = input.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(input.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

async function groqChat(
  messages: Array<{ role: "system" | "user"; content: string }>
) {
  const apiKey = process.env.GROQ_API_KEY ?? "";
  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY");
  }

  const response = await fetch(GROQ_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.2,
      messages,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Groq API error: ${text}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
}

export async function analyzeCandidate(payload: AnalysisPayload) {
  const content = await groqChat([
    { role: "system", content: SYSTEM_ANALYSIS_PROMPT },
    {
      role: "user",
      content: JSON.stringify({
        instructions:
          "Return JSON with keys: score, decision, summary, strengths, weaknesses, missing_requirements, interview_questions, improvement_suggestions. Evaluate only using job title, role description, requirements, seniority level, applicant answers, and CV text.",
        payload,
      }),
    },
  ]);

  const parsed = safeJsonParse(content) as GroqAnalysis | null;
  if (!parsed) {
    throw new Error("Groq returned invalid JSON");
  }

  return parsed;
}

export async function generateCvDraft(input: {
  name: string;
  email: string;
  education: string;
  skills: string;
  experience: string;
  projects: string;
  jobTitle: string;
  jobDescription: string;
}) {
  const content = await groqChat([
    { role: "system", content: SYSTEM_CV_PROMPT },
    {
      role: "user",
      content: JSON.stringify({
        instructions:
          "Write a tailored CV draft with sections: Summary, Experience, Projects, Skills, Education.",
        input,
      }),
    },
  ]);

  return content.trim();
}
