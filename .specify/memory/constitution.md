<!--
Sync Impact Report
==================
Version change: TEMPLATE → 1.0.0 (initial ratification)
Modified principles: N/A (first concrete version, template placeholders replaced)
Added sections:
  - Core Principles I-V (Product Principles)
  - Code Quality Standards (Section 2)
  - Development Workflow (Section 3)
  - Version Control Principles (Section 4)
  - Governance
Removed sections: none
Templates requiring updates:
  - .specify/templates/plan-template.md ⚠ pending manual review (verify Constitution Check section references these principles)
  - .specify/templates/spec-template.md ⚠ pending manual review (verify scope/requirements alignment, e.g. RTL/offline/elderly-UX considerations)
  - .specify/templates/tasks-template.md ⚠ pending manual review (verify task categorization reflects commit-granularity and code-quality gates)
Follow-up TODOs:
  - TODO(RATIFICATION_DATE): Original ratification date unknown beyond today; using date of this constitution's first authoring (2026-07-21) as both ratified and last amended date.
-->

# SmartDiabetes Monitor Constitution

## Core Principles

### I. Elderly-Friendly Design
The interface MUST be usable by elderly patients with minimal assistance. All body text
MUST be 16px or larger; interactive targets MUST use generous spacing to prevent
mis-taps; UX flows MUST minimize the number of steps and decisions required per task.
Screens MUST avoid dense information layouts, jargon, and small controls.
Rationale: The primary user base skews elderly, where small text, cramped tap targets,
and complex flows directly cause task failure and frustration.

### II. Offline-First Functionality
Core features (logging readings, viewing history, reminders) MUST function fully
without an internet connection. Data MUST be persisted locally and synced
opportunistically when connectivity is available. No critical user action may be
blocked solely due to lack of network access.
Rationale: Target users may have unreliable connectivity; a health-tracking tool that
fails offline is unsafe and untrustworthy.

### III. RTL Arabic Support Throughout
Every screen, component, and layout MUST support right-to-left (RTL) Arabic rendering
as a first-class mode, not a bolt-on translation layer. Layout direction, iconography,
and text alignment MUST be verified in both LTR and RTL before a feature is considered
complete.
Rationale: Arabic-speaking users are a core audience; RTL must be designed in from the
start to avoid costly retrofits and broken layouts.

### IV. Next.js + Fetch AI as Core Architecture
The application MUST be built on Next.js, with Fetch AI integration as a core
architectural component (not an optional add-on). New features MUST fit within this
architecture unless a documented exception is approved via clarification.
Rationale: A consistent, agreed-upon architecture avoids fragmentation and keeps the
codebase predictable across contributors.

### V. Mobile-First (Poco Android + iOS)
Design and implementation MUST start from the mobile viewport, with Poco Android
devices and iOS as the primary target form factors. Desktop/tablet layouts are
secondary adaptations, not the starting point.
Rationale: The target audience primarily accesses the app on budget Android phones
(Poco) and iOS devices; mobile-first ensures the primary experience is never degraded
to accommodate larger screens.

## Code Quality Standards

**DRY (Don't Repeat Yourself)**: Logic MUST NOT be duplicated. Repeated code MUST be
extracted into reusable functions, components, or utilities before a feature is
considered done.

**Clean Code & Structure**: Naming conventions MUST be consistent across the codebase.
Functions and components MUST follow single-responsibility. Folder organization MUST
be logical (e.g. `components/`, `lib/`, `pages/api/`). UI logic MUST be clearly
separated from business/data logic.

**Well-Commented Code**: Comments MUST explain "why", not restate "what" the code
already makes obvious. Every non-trivial function MUST have a brief description of its
purpose, parameters, and return value.

**Simplicity First**: The simplest working solution MUST be implemented before adding
complexity. Premature optimization and over-engineering are prohibited.

**Stay In Scope**: Only features explicitly defined in the spec and plan MAY be
implemented. Ambiguity MUST be flagged via clarification rather than resolved by
expanding scope on assumption.

## Development Workflow

Features MUST be built incrementally: one feature is completed and tested before the
next begins. Readability MUST be preferred over cleverness. Existing components and
utilities MUST be reused before new ones are created. No dead code may be left in the
codebase — unused code MUST be deleted, not commented out or left "just in case".

## Version Control Principles

Commits MUST be frequent and scoped to small, logical chunks. Unrelated features or
large amounts of work MUST NOT be bundled into a single commit. A commit MUST be made
after completing each meaningful stage or task (e.g., one component, one API route,
one feature step) rather than accumulating many changes before committing. Every
commit message MUST clearly describe what was done in that specific stage (e.g., "Add
patient card component", "Implement blood sugar step 1 number pad") — vague messages
such as "update" or "changes" are prohibited. Large, monolithic commits that mix
multiple features are prohibited, as they impede review, debugging, and rollback of
individual changes.

## Governance

This constitution supersedes all other informal practices for the SmartDiabetes
Monitor project. Amendments require: (1) a documented rationale for the change, (2)
an explicit version bump following the semantic versioning policy below, and (3)
propagation of the change to any dependent templates or guidance docs in the same
change set.

**Versioning Policy**: Constitution versions follow MAJOR.MINOR.PATCH semantics:
- MAJOR: Backward-incompatible governance changes or removal/redefinition of a
  principle.
- MINOR: A new principle or section is added, or existing guidance is materially
  expanded.
- PATCH: Clarifications, wording fixes, and non-semantic refinements.

**Compliance Review**: All plans and implementation work MUST be checked against
these principles (particularly elderly-friendly UX, offline-first behavior, and RTL
support) before being marked complete. Any complexity that deviates from Simplicity
First or Stay In Scope MUST be explicitly justified in the relevant plan document.

**Version**: 1.0.0 | **Ratified**: 2026-07-21 | **Last Amended**: 2026-07-21
