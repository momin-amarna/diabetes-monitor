# مراقب السكري الذكي — SmartDiabetes Monitor

A Next.js PWA for tracking blood sugar and weight for elderly patients (or
anyone caring for them), with AI-generated health insights, offline-first
storage, and an Arabic RTL interface designed for large touch targets and
simple, elderly-friendly navigation.

## Features

- **Login** — one-time email entry, no password, persists on the device
- **Multiple patients** — track any number of people, each with a name,
  optional emoji, and color
- **Blood sugar measurements** — 5-step guided entry (reading, fasting
  hours, date/time, optional notes, confirm)
- **Weight tracking** — 2-step guided entry with weekly reminders
- **AI-powered insights** — a plain-language health insight after every
  measurement, backed by Fetch AI with a rule-based fallback
- **History** — filter, edit, and delete past measurements/weight entries
- **Settings** — notes visibility, time input method, font size, spacing,
  high contrast, weekly reminders, backup/restore, clear all data
- **Offline-first** — localStorage is the source of truth; Google Sheets
  sync happens best-effort when configured and online
- **Public landing page** at `/`, the app itself at `/app`

## Tech Stack

- [Next.js 14](https://nextjs.org/) (Pages Router)
- React 18 + Tailwind CSS
- [`@fetchai/ai-engine-sdk`](https://www.npmjs.com/package/@fetchai/ai-engine-sdk)
  for AI health insights
- `googleapis` for Google Sheets sync
- localStorage for offline-first data persistence

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the landing page,
or [http://localhost:3000/app](http://localhost:3000/app) to go straight
into the app.

### Available Scripts

| Command         | Description                        |
| ---------------- | ---------------------------------- |
| `npm run dev`    | Start the local development server |
| `npm run build`  | Create a production build          |
| `npm run start`  | Run the production build           |
| `npm run lint`   | Run ESLint                         |

## Environment Variables

Copy `.env.local` (already present with placeholders) and fill in real
values as needed. Every integration below degrades gracefully when left
unconfigured — the app still fully works offline with localStorage and a
rule-based insight fallback.

| Variable                       | Used for                                   | Required? |
| ------------------------------- | ------------------------------------------- | --------- |
| `GOOGLE_SHEETS_API_KEY`         | Reading/writing the backing Google Sheet    | Optional  |
| `GOOGLE_CLIENT_ID`              | OAuth for Google Sheets access              | Optional  |
| `GOOGLE_SHEETS_SPREADSHEET_ID`  | Target spreadsheet for sync                 | Optional  |
| `AGENTVERSE_API_KEY`            | Fetch AI health insight generation          | Optional  |
| `NEXT_PUBLIC_DEMO_VIDEO_URL`    | Overrides the bundled demo video with an embedded URL (e.g. YouTube) | Optional  |

> **Note:** Google Sheets sync currently reports whether it's configured
> (`isSheetsConfigured()`) but the OAuth read/write flow itself
> (`/api/sheets/*`) is not yet implemented — data safety in production
> relies on localStorage plus the Settings → Backup/Restore JSON export.

## Project Structure

```
pages/
  index.js          # Public landing page
  app.js            # Main app (login → dashboard)
  api/              # measurements, weights, patients, health (AI), sheets
components/
  Auth/             # Login form
  Dashboard/        # Patient cards, measurement/weight forms, history, AI insights
  PatientManagement/# Add/edit/delete patients
  Settings/         # Settings page, reminders, backup/restore
  LandingPage/       # Hero, Problem, Solution, Features, Demo, CTA
  Shared/           # ModalShell, NumberKeypad, Spinner, StepButtons
lib/
  storage.js        # localStorage read/write helpers (source of truth)
  models.js         # Data shape factories (Patient, Measurement, WeightRecord, Settings)
  validation.js     # Form validation
  fetchai-client.js # Client-side wrapper for the AI insight API
  sheets-api.js     # Google Sheets API wrapper
  reminders.js      # Weekly weight reminder logic
  utils.js          # Date/format helpers
specs/001-diabetes-monitor/
  spec.md, plan.md, tasks.md  # Feature spec, implementation plan, task list
```

## Deployment

The project is deployed on [Vercel](https://vercel.com). To deploy your
own copy:

1. Push the repo to GitHub.
2. Import it in Vercel.
3. Add the environment variables listed above in the Vercel project
   dashboard (Settings → Environment Variables) if you want live Sheets
   sync and Fetch AI insights instead of the offline/rule-based fallback.
4. Deploy — Vercel builds with `npm run build` automatically.

## Testing

There is no automated test suite (by design, per the project's MVP scope
— see `specs/001-diabetes-monitor/plan.md`). Each user story is manually
testable independently; see the acceptance scenarios in
`specs/001-diabetes-monitor/spec.md`.
