# Helix HR Recruitment Platform

AI-powered recruitment web application built with Next.js App Router, Supabase, and Groq.

## Requirements

- Node.js 18+
- Supabase project with tables and storage buckets

## Environment variables

Create a `.env.local` file with the following values:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
GROQ_API_KEY=
RESEND_API_KEY=
ADMIN_PASSWORD=
```

## Supabase tables

`jobs`

- id
- title
- department
- description
- requirements
- skills_required (text[])
- experience_required
- questions (json)
- deadline (date)
- status
- created_at
- location (optional)

`applicants`

- id
- name
- email
- phone
- job_id
- cv_url
- photo_url
- answers (json)
- ai_score
- ai_summary
- ai_strengths (json)
- ai_weaknesses (json)
- ai_recommendation
- ai_questions (json)
- ai_improvements (json)
- status
- created_at

## Supabase storage buckets

- cv-uploads
- generated-cvs
- candidate-photos

## Run locally

```
npm run dev
```

## Admin access

- Visit `/admin/login`
- Use the password from `ADMIN_PASSWORD`

## Notes

- Configure Supabase RLS policies to allow the required inserts and reads for public pages.
- The Resend sender domain should be updated in `src/lib/email/send.ts`.
