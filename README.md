# Job Match Portal

Paste a job description, see how it matches your resume, get concrete
suggestions to close the gap, then track the application.

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind · Prisma + Postgres ·
Gemini via `@langchain/google-genai`

## What's built (base)

- Dashboard listing tracked jobs with a score badge + status pill
- "Add Job" flow — paste company, role, source, JD text → saved as a `JobApplication`
- Job detail page (renders the JD; analysis section is a placeholder)
- Resume page (placeholder — structured editor comes next)
- Full Prisma schema: `Resume`, `JobApplication`, `MatchAnalysis`
- `lib/gemini.ts` — Gemini client wrapper with a `getStructuredResponse<T>()`
  helper for clean JSON extraction, ready for the matching engine

## Not built yet (next up)

- Structured resume editor (skills/projects/experience as data)
- JD extraction pass (Gemini pulls required/nice-to-have skills from the JD)
- Scoring engine (hard match % + semantic score + combined score)
- Suggestion generation grounded in your actual resume content
- Applying suggestions to produce a tailored resume variant per job

## Setup

```bash
npm install

# copy and fill in
cp .env.example .env
# DATABASE_URL -> your Postgres connection string (Supabase/Neon/local)
# GEMINI_API_KEY -> from Google AI Studio

npx prisma migrate dev --name init
npx prisma generate

npm run dev
```

Visit `http://localhost:3000`.

## Project structure

```
app/
  page.tsx              dashboard
  jobs/new/page.tsx      add-job form
  jobs/[id]/page.tsx     job detail
  resume/page.tsx        resume editor (stub)
  api/jobs/route.ts      job CRUD
components/
  Sidebar.tsx
  ScoreBadge.tsx          radial match-score gauge
  StatusPill.tsx
lib/
  prisma.ts               Prisma client singleton
  gemini.ts               Gemini/LangChain wrapper
prisma/
  schema.prisma
types/
  resume.ts               ResumeContent, ProjectEntry, ExperienceEntry
  analysis.ts              AnalysisResult, Suggestion, JDExtraction
```
