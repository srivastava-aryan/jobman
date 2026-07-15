# Job Match Portal

A personal job-application copilot that helps you answer one question clearly:

**“How well does my current resume match this specific job, and what should I change to improve my odds?”**

You paste a job description, the app compares it against your resume, generates actionable gap-closing suggestions, and lets you track the application over time.

---

## Why this project exists

Tailoring resumes manually for every role is slow and inconsistent.  
This tool makes the process structured and repeatable by combining:

- **Resume data** (your actual experience/skills/projects)
- **Job description analysis** (required vs preferred signals)
- **Scoring + suggestions** (what matches, what’s weak, what to improve)
- **Application tracking** (status and progress per job)

It is intentionally built as a **single-user private tool** (not a multi-tenant SaaS app).

---

## Core workflow

1. **Add a job**
   - Paste company, role, source link, and full JD text.
2. **Analyze match**
   - Extract requirements from the JD.
   - Compare against structured resume content.
   - Produce hard-match / semantic / combined scores.
3. **Get targeted suggestions**
   - Suggestions are grounded in your real resume data (not generic advice).
4. **(Next) Generate a tailored resume variant**
   - Apply approved suggestions for a job-specific resume version.
5. **Track application status**
   - Keep all roles in one dashboard with score + stage.

---

## Tech stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **UI:** Tailwind CSS
- **Database:** Postgres + Prisma ORM
- **LLM Integration:** Gemini via `@langchain/google-genai`
- **Validation:** Zod for strict schema validation of model outputs and stored JSON

---

## Current status

### ✅ Implemented (base)

- Dashboard with tracked jobs, score badge, and status pill
- “Add Job” flow that saves JD + metadata into `JobApplication`
- Job detail page that renders JD content (analysis section scaffolded)
- Resume page scaffold (structured editor in progress)
- Prisma schema with key models:
  - `Resume`
  - `JobApplication`
  - `MatchAnalysis`
- `lib/gemini.ts` wrapper with `getStructuredResponse<T>()` for reliable JSON extraction

### 🚧 In progress / next

- Structured resume editor (skills/projects/experience as typed data)
- JD extraction pass (required vs nice-to-have skills)
- Scoring engine:
  - hard match %
  - semantic score
  - weighted combined score
- Suggestion generation grounded in resume evidence
- Tailored resume generation per job application

---

## Data model (high level)

- **Resume**
  - Canonical source of truth for user profile content
  - Stores structured JSON validated by Zod
- **JobApplication**
  - Role/company/source/JD text + workflow status
  - Optionally linked to a tailored resume
- **MatchAnalysis**
  - Persisted scoring + extraction + suggestion outputs

This separation allows:
- multiple analyses per job over time,
- multiple tailored variants,
- safer iteration without mutating original resume data.

---

## Security & integrity decisions

This app handles sensitive personal/career data and untrusted JD text, so guardrails are built in:

- **Basic Auth gate via `middleware.ts`**
  - Controlled by `APP_USERNAME` / `APP_PASSWORD`
  - Suitable for single-user/private deployment
- **Zod validation on model outputs**
  - LLM JSON is validated before use
  - Automatic retry on malformed responses
- **Defensive DB JSON handling**
  - Resume JSON from DB passes through `toResumeContent()` in `lib/resume.ts`
  - Graceful field-level degradation on shape mismatch
- **Prompt-injection-aware prompting**
  - Prompts instruct model to treat JD and resume as data, not executable instructions
- **Transactional writes**
  - Tailored resume creation + job linking run in one `prisma.$transaction`
  - Prevents partial/orphaned writes
- **Safe relational behavior**
  - `Resume -> JobApplication` uses `onDelete: SetNull`
  - Deleting a resume does not cascade-delete job records

---

## Local development setup

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment

```bash
cp .env.example .env
```

Populate:

- `DATABASE_URL` → Postgres connection string (Supabase / Neon / local)
- `GEMINI_API_KEY` → Google AI Studio key
- `APP_USERNAME` / `APP_PASSWORD` → required for Basic Auth protection

### 3) Run migrations + generate Prisma client

```bash
npx prisma migrate dev --name init
npx prisma generate
```

If upgrading from an older version (before tailored-resume support):

```bash
npx prisma migrate dev --name add_tailored_resume
```

### 4) Start dev server

```bash
npm run dev
```

Open: `http://localhost:3000`

---

## Project structure

```text
app/
  page.tsx               # dashboard
  jobs/new/page.tsx      # add-job form
  jobs/[id]/page.tsx     # job detail
  resume/page.tsx        # resume editor (stub)
  api/jobs/route.ts      # job CRUD

components/
  Sidebar.tsx
  ScoreBadge.tsx         # radial match-score gauge
  StatusPill.tsx

lib/
  prisma.ts              # Prisma client singleton
  gemini.ts              # Gemini/LangChain wrapper
  resume.ts              # runtime validation/normalization helpers
  schemas.ts             # Zod schemas for extraction/analysis/suggestions

prisma/
  schema.prisma

types/
  resume.ts              # ResumeContent, ProjectEntry, ExperienceEntry
  analysis.ts            # AnalysisResult, Suggestion, JDExtraction
```

---

## Product direction (planned)

- Suggestion approval UI (accept/reject/edit suggestion)
- Side-by-side diff between base resume and tailored variant
- Re-run analysis history + versioned scoring timeline
- Export tailored resume to Markdown/PDF
- Better source attribution in suggestions (“which resume evidence was used”)

---

## Known limitations

- Not designed for multi-user auth/roles yet
- LLM quality can vary by JD complexity and prompt fit
- Semantic scoring is helpful but not absolute truth
- Requires user judgment before applying generated suggestions

---

## Contributing notes (for future collaborators)

If you extend analysis or tailoring logic:

1. Update Zod schemas first (`lib/schemas.ts`)
2. Keep prompts deterministic and injection-aware
3. Validate all model output before DB writes
4. Prefer transactions for multi-entity writes
5. Preserve original resume data; write tailored variants separately

---

## Disclaimer

This tool supports resume tailoring and application tracking; it does **not** guarantee interview outcomes or hiring decisions.  
Use generated suggestions as drafting assistance, then apply personal judgment.

---

If you want, I can also generate:
- a **short “public portfolio” README** version, and
- a **developer-focused README** (architecture + request/response contracts + schema docs).
