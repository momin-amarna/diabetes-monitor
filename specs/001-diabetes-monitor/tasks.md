---
description: "Task list for SmartDiabetes Monitor implementation"
---

# Tasks: SmartDiabetes Monitor

**Input**: Design documents from `/specs/001-diabetes-monitor/`

**Prerequisites**: plan.md, spec.md

**Tests**: Not included — no automated test suite requested for MVP scope (manual testing per user story instead)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US7)

## Path Conventions

Single Next.js project. All paths relative to repository root (`pages/`, `components/`, `lib/`, `public/`).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize Next.js project (Pages Router) with Tailwind CSS
- [x] T002 Create folder structure: `pages/api/`, `components/`, `lib/`, `public/icons/`
- [x] T003 [P] Configure ESLint + Prettier
- [x] T004 [P] Set up `.env.local` with placeholders: `GOOGLE_SHEETS_API_KEY`, `GOOGLE_CLIENT_ID`, `AGENTVERSE_API_KEY`
- [x] T005 [P] Configure `next.config.js` for PWA support
- [x] T006 Set root layout with `dir="rtl"`, Arabic font, and base Tailwind theme (colors/spacing tokens from constitution)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Create data models (plain JS objects/JSDoc types) for Patient, Measurement, WeightRecord, Settings in `lib/models.js`
- [x] T008 [P] Implement `lib/storage.js` — localStorage read/write helpers (get/set/remove per key, JSON parse/stringify safety)
- [x] T009 [P] Implement `lib/sheets-api.js` — Google Sheets API client wrapper (auth, read, append, update)
- [x] T010 [P] Implement `lib/fetchai-client.js` — wrapper around `@fetchai/ai-engine-sdk` (session creation, send message, parse response)
- [x] T011 Create `public/manifest.json` and `public/service-worker.js` for offline/PWA support
- [x] T012 Build shared `components/Dashboard/TabNavigation.js` (Blood Sugar | Weight | Statistics tabs)
- [x] T013 Build shared empty-state component for "no patients yet"

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 3: User Story 1 - Login and View Patients (Priority: P1) 🎯 MVP

**Goal**: User enters email once, sees home screen with patient cards on every subsequent visit

**Independent Test**: Enter email, close app, reopen, confirm home screen shows directly with patient cards

### Implementation for User Story 1

- [x] T014 [US1] Create `components/Auth/LoginForm.js` (email input + validation + save to localStorage via `lib/storage.js`)
- [x] T015 [US1] Create `pages/app.js` — check localStorage on load, render LoginForm or Dashboard accordingly
- [x] T016 [US1] Create `components/Dashboard/PatientCard.js` (emoji, name, last reading, time-ago, gradient background, tap handler)
- [x] T017 [US1] Seed default patients (Father/Mother) in `lib/storage.js` on first run if none exist
- [x] T018 [US1] Wire up home screen in `pages/app.js` to render `PatientCard` per patient from storage
- [x] T019 [US1] Add logout action (clear email from localStorage, return to LoginForm)

**Checkpoint**: Login + home screen with patient cards fully functional and testable independently

---

## Phase 4: User Story 2 - Add Blood Sugar Measurement (Priority: P1)

**Goal**: User completes 5-step flow to record a blood sugar reading

**Independent Test**: Tap "New Measurement" on a patient card, complete all 5 steps, confirm it appears as "last measurement"

### Implementation for User Story 2

- [x] T020 [P] [US2] Create `pages/api/measurements/add.js` (validate + save to localStorage-synced data + trigger Sheets sync)
- [x] T021 [P] [US2] Create `pages/api/measurements/list.js`
- [x] T022 [US2] Build `components/Dashboard/MeasurementForm.js` — Step 1: reading number pad
- [x] T023 [US2] Extend `MeasurementForm.js` — Step 2: fasting hours number pad (depends on T022)
- [x] T024 [US2] Extend `MeasurementForm.js` — Step 3: date/time arrow spinners (day/month/hour/minute) + manual HH:MM toggle (depends on T023)
- [x] T025 [US2] Extend `MeasurementForm.js` — Step 4: optional notes (Yes/No + textarea, respects settings toggle) (depends on T024)
- [x] T026 [US2] Extend `MeasurementForm.js` — Step 5: summary + confirm/edit/cancel (depends on T025)
- [x] T027 [US2] Wire "New Measurement" button on `PatientCard` to open `MeasurementForm`
- [x] T028 [US2] On confirm, save via `lib/storage.js` + call `pages/api/measurements/add.js`, update patient's "last measurement" display
- [x] T029 [US2] Add input validation (empty reading blocked, fasting hours 0–24 only)

**Checkpoint**: User Stories 1 AND 2 both work independently — this is the MVP

---

## Phase 5: User Story 3 - Manage Multiple Patients (Priority: P2)

**Goal**: Add/edit/delete unlimited patients with custom name, emoji, color

**Independent Test**: Add a patient with custom name/emoji/color, confirm new card appears, edit it, delete it

### Implementation for User Story 3

- [x] T030 [P] [US3] Create `pages/api/patients/add.js`, `edit.js`, `delete.js`, `list.js`
- [x] T031 [P] [US3] Build `components/PatientManagement/ColorPicker.js` (8 preset colors, selected state)
- [x] T032 [US3] Build `components/PatientManagement/AddEditPatient.js` (name input, emoji grid picker, ColorPicker, save/cancel)
- [x] T033 [US3] Build `components/PatientManagement/PatientList.js` (list of patients with edit/delete icons)
- [x] T034 [US3] Wire "+ Add Patient" button on home screen to open `AddEditPatient`
- [x] T035 [US3] Implement soft-delete (mark patient inactive, keep historical data) with confirmation dialog
- [x] T036 [US3] Update home screen to render dynamically from all active patients (replace hardcoded Father/Mother assumption)

**Checkpoint**: Patient management fully functional alongside US1 and US2

---

## Phase 6: User Story 4 - Track Weight (Priority: P2)

**Goal**: User records weight through simplified 2-step flow

**Independent Test**: Switch to Weight tab, add weight through both steps, confirm it shows as "last weight"

### Implementation for User Story 4

- [x] T037 [P] [US4] Create `pages/api/weights/add.js`, `edit.js`, `delete.js`, `list.js`
- [x] T038 [US4] Build `components/Dashboard/WeightForm.js` — Step 1: weight number pad with decimal point
- [x] T039 [US4] Extend `WeightForm.js` — Step 2: date-only arrow spinners (day/month/year) (depends on T038)
- [x] T040 [US4] Wire Weight tab in `TabNavigation` to show weight-variant `PatientCard`s with "Add Weight" button
- [x] T041 [US4] Add validation (reject weight ≤ 0)

**Checkpoint**: Weight tracking functional alongside all previous stories

---

## Phase 7: User Story 5 - Edit and Delete Historical Records (Priority: P2)

**Goal**: User can correct or remove past measurement/weight entries

**Independent Test**: Open history, edit one record, confirm updated value shows; delete another, confirm it disappears

### Implementation for User Story 5

- [x] T042 [P] [US5] Build `components/Dashboard/HistoryList.js` (shared component, works for both measurements and weights via props)
- [x] T043 [US5] Add filter controls (by patient, by date range) to `HistoryList.js`
- [x] T044 [US5] Add edit icon per row → reopens `MeasurementForm`/`WeightForm` pre-filled with existing values
- [x] T045 [US5] Add delete icon per row → confirmation dialog → calls respective `delete.js` API route
- [x] T046 [US5] Wire history access point (e.g., long-press patient card or dedicated link) to open `HistoryList.js`

**Checkpoint**: Full CRUD on measurements and weights complete

---

## Phase 8: User Story 6 - Receive AI-Powered Health Insights (Priority: P3)

**Goal**: Display Fetch AI-generated insight after a blood sugar measurement is saved

**Independent Test**: Save a measurement, confirm an AI-generated insight message appears afterward

### Implementation for User Story 6

- [ ] T047 [US6] Create `pages/api/health/analyze.js` — calls `lib/fetchai-client.js` with reading + fasting hours, returns insight text
- [ ] T048 [US6] Build `components/Dashboard/AIInsights.js` — displays insight text + loading state + fallback message on failure
- [ ] T049 [US6] Wire `AIInsights.js` to trigger automatically after T028 (measurement save) completes
- [ ] T050 [US6] Handle Fetch AI timeout/failure gracefully (measurement must still save successfully regardless of AI result)

**Checkpoint**: AI insights working without blocking core measurement flow

---

## Phase 9: User Story 7 - Customize Settings (Priority: P3)

**Goal**: User adjusts notes visibility, time input method, font/spacing, contrast, reminders, landing page button, backups

**Independent Test**: Toggle each setting individually, confirm corresponding behavior changes immediately

### Implementation for User Story 7

- [ ] T051 [P] [US7] Build `components/Settings/SettingsPage.js` — shell with all sections
- [ ] T052 [US7] Add notes screen toggle (reads/writes `lib/storage.js`, respected by T025)
- [ ] T053 [US7] Add time input method toggle (arrows vs manual, respected by T024)
- [ ] T054 [US7] Add font size + spacing + high contrast controls (apply via Tailwind theme classes on root layout)
- [ ] T055 [US7] Add "hide landing page button" toggle (respected by home screen button visibility)
- [ ] T056 [P] [US7] Build `components/Settings/ReminderSettings.js` (day dropdown + time picker, saved to storage)
- [ ] T057 [US7] Implement `lib/reminders.js` — check current day/time against saved reminder on app load, show in-app banner if due
- [ ] T058 [P] [US7] Build `components/Settings/BackupRestore.js` — export all localStorage data as JSON file, import/restore from JSON file
- [ ] T059 [US7] Add "clear all data" with confirmation dialog
- [ ] T060 [US7] Add account section (display email, copy button, logout — reuses T019)

**Checkpoint**: All settings functional; app fully feature-complete per spec

---

## Phase 10: Landing Page & Deployment (Course Requirements)

**Purpose**: Public-facing landing page and live deployment

- [ ] T061 [P] Build `components/LandingPage/Hero.js`
- [ ] T062 [P] Build `components/LandingPage/Problem.js`
- [ ] T063 [P] Build `components/LandingPage/Solution.js`
- [ ] T064 [P] Build `components/LandingPage/Features.js`
- [ ] T065 [P] Build `components/LandingPage/Demo.js` (video embed placeholder)
- [ ] T066 [P] Build `components/LandingPage/CTA.js`
- [ ] T067 Assemble `pages/index.js` from all landing components above
- [ ] T068 Deploy project to Vercel, configure environment variables in Vercel dashboard
- [ ] T069 Verify production build works end-to-end (login → measurement → AI insight → Sheets sync)

---

## Phase 11: Polish & Cross-Cutting Concerns

- [ ] T070 [P] Add error handling + user-friendly error messages across all API routes
- [ ] T071 [P] Verify offline behavior (airplane mode test: add measurement, reconnect, confirm sync)
- [ ] T072 Review all components for RTL correctness and touch target sizes
- [ ] T073 Code cleanup pass — remove dead code, ensure DRY per constitution
- [ ] T074 Final manual test pass through all 7 user stories end-to-end
- [ ] T075 Write `README.md` with setup/run/deploy instructions

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **User Stories (Phases 3–9)**: All depend on Foundational completion
  - P1 stories (US1, US2) should be built first — they form the MVP
  - P2 stories (US3, US4, US5) next
  - P3 stories (US6, US7) last
- **Landing Page & Deployment (Phase 10)**: Can start in parallel with later user stories, but final deploy (T068–T069) should follow feature completion
- **Polish (Phase 11)**: Depends on all desired user stories being complete

### Recommended Build Order (Solo Developer)

1. Phase 1 → Phase 2 (Foundational) — must finish first
2. Phase 3 (US1) → Phase 4 (US2) — MVP checkpoint, demoable
3. Phase 5 (US3) → Phase 6 (US4) → Phase 7 (US5)
4. Phase 8 (US6) → Phase 9 (US7)
5. Phase 10 (Landing + Deploy)
6. Phase 11 (Polish)

---

## Notes

- [P] tasks = different files, no dependencies — can be done in any order within their phase
- Commit after each completed task or small logical group (per constitution: small, frequent, clearly-labeled commits)
- Stop at each phase checkpoint to manually verify that story works before moving on
- Avoid: vague commits, mixing multiple stories in one commit, expanding scope beyond what's listed here