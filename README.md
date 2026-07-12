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
# DATABASE_URL   -> your Postgres connection string (Supabase/Neon/local)
# GEMINI_API_KEY -> from Google AI Studio
# APP_USERNAME / APP_PASSWORD -> Basic Auth credentials. Required before
#   deploying anywhere public — the app is unauthenticated without them.

npx prisma migrate dev --name init
npx prisma generate

npm run dev
```

Visit `http://localhost:3000`.

If you're pulling in changes from an earlier version of this project (before
the tailored-resume feature), run one more migration:

```bash
npx prisma migrate dev --name add_tailored_resume
```

## Security & data integrity notes

- All routes sit behind `middleware.ts` Basic Auth once `APP_USERNAME`/`APP_PASSWORD` are set — this is a single-user tool, not multi-tenant, so one shared credential gating everything is the right shape rather than per-route auth checks.
- LLM responses (JD extraction, semantic scoring, suggestions, tailoring) are validated against Zod schemas in `lib/schemas.ts` before being trusted, with one automatic retry on a malformed or failed response.
- Resume JSON read from the DB goes through `toResumeContent()` (in `lib/resume.ts`), which validates with Zod and degrades gracefully per-field instead of crashing on unexpected shape.
- Prompts explicitly instruct the model to treat job descriptions and resume content as data, not instructions — a basic defense against prompt injection via pasted JD text.
- Creating a tailored resume and linking it to a job happens inside a single `prisma.$transaction`, so a failure partway through can't leave an orphaned resume record.
- `Resume` → `JobApplication` relations use `onDelete: SetNull` — deleting a resume never cascades into deleting job applications or blocks on a foreign key error.

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
