# Implementation Plan: SmartDiabetes Monitor

**Branch**: `001-diabetes-monitor` | **Date**: 2026-07-21 | **Spec**: specs/001-diabetes-monitor/spec.md

**Input**: Feature specification from `/specs/001-diabetes-monitor/spec.md`

## Summary

Build a Next.js web application for tracking diabetes (blood sugar) and 
weight measurements for elderly patients, with AI-generated health 
insights via Fetch AI, offline-first data storage synced to Google 
Sheets, and a public landing page. Primary technical approach: 
client-heavy Next.js app using localStorage as the source of truth 
for offline-first behavior, with Next.js API routes handling Google 
Sheets sync and Fetch AI calls.

## Technical Context

**Language/Version**: JavaScript (Node.js 20+), Next.js 14 (Pages Router)

**Primary Dependencies**: React, Tailwind CSS, googleapis, 
@fetchai/ai-engine-sdk

**Storage**: localStorage (offline-first primary store) + Google Sheets 
API (per-patient sheets, synced when online)

**Testing**: Manual testing per user story (no automated test suite 
for MVP scope)

**Target Platform**: Web (PWA) — primary devices: Android (Poco phones) 
and iOS via Safari "Add to Home Screen"

**Project Type**: web (single Next.js project, frontend + backend via 
API routes)

**Performance Goals**: App loads in under 2 seconds; AI insight 
returned within 5 seconds of measurement save

**Constraints**: Must work fully offline for core recording features; 
RTL Arabic layout; minimum 48x48px touch targets; large fonts (16px+ 
body, 28px+ headers) for elderly usability

**Scale/Scope**: Single-family use per account (unlimited patients per 
account, not multi-tenant); ~15 screens total

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Elderly-friendly design → enforced via Tailwind design tokens (large 
  font/spacing scale) — PASS
- Offline-first → localStorage as primary store, Sheets as sync target 
  — PASS
- RTL Arabic support → `dir="rtl"` at root layout, Arabic copy 
  throughout — PASS
- Next.js + Fetch AI integration → API route wraps 
  @fetchai/ai-engine-sdk — PASS
- Simplicity first / stay in scope → structure below uses a single 
  Next.js project, no unnecessary services — PASS
- No violations requiring justification.

## Project Structure

### Documentation (this feature)

```text
specs/001-diabetes-monitor/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md
```

### Source Code (repository root)

```text
# Option 2: Web application (Next.js single project, frontend + backend via API routes)

pages/
├── index.js                        # Landing page
├── app.js                          # Main authenticated app shell (tabs, routing state)
└── api/
    ├── health/
    │   └── analyze.js              # Fetch AI insight endpoint
    ├── patients/
    │   ├── list.js
    │   ├── add.js
    │   ├── edit.js
    │   └── delete.js
    ├── measurements/
    │   ├── list.js
    │   ├── add.js
    │   ├── edit.js
    │   └── delete.js
    ├── weights/
    │   ├── list.js
    │   ├── add.js
    │   ├── edit.js
    │   └── delete.js
    └── sheets/
        └── sync.js                 # Google Sheets sync endpoint

components/
├── LandingPage/
│   ├── Hero.js
│   ├── Problem.js
│   ├── Solution.js
│   ├── Features.js
│   ├── Demo.js
│   └── CTA.js
├── Auth/
│   └── LoginForm.js
├── Dashboard/
│   ├── TabNavigation.js
│   ├── PatientCard.js
│   ├── MeasurementForm.js          # 5-step blood sugar flow
│   ├── WeightForm.js               # 2-step weight flow
│   ├── HistoryList.js              # shared by measurements & weights
│   └── AIInsights.js
├── PatientManagement/
│   ├── PatientList.js
│   ├── AddEditPatient.js
│   └── ColorPicker.js
└── Settings/
    ├── SettingsPage.js
    ├── ReminderSettings.js
    └── BackupRestore.js

lib/
├── storage.js                      # localStorage read/write helpers
├── sheets-api.js                   # Google Sheets client wrapper
├── fetchai-client.js                # AI Engine SDK wrapper
└── reminders.js                    # weekly reminder scheduling logic

public/
├── manifest.json
├── service-worker.js
└── icons/

tests/
└── manual/                         # manual test checklists per user story
```

**Structure Decision**: Single Next.js project (Option 2, simplified — 
frontend and backend coexist in one Next.js app via Pages Router and 
API routes; no separate backend/frontend folders needed since Next.js 
API routes serve as the backend).

## Complexity Tracking

*No constitution violations — table not needed.*