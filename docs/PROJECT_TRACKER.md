# Project Tracker

This file is the lightweight Jira-style tracker for Simulation Studio. Keep it current as work progresses.

## Status Rules

Task status values:

- `TODO`: planned but not started.
- `IN_PROGRESS`: actively being worked on.
- `BLOCKED`: cannot proceed without owner input, dependency, or external fix.
- `DONE`: implementation/documentation is complete and local QA required for the task has passed.
- `REVIEWED`: task was reviewed using the relevant review path and important findings were resolved or accepted.

Review values:

- `NOT_REQUIRED`: task is too small or administrative for a formal review.
- `PENDING`: task needs review before milestone completion.
- `REVIEWED`: review completed and stored or summarized in the task notes.
- `FOLLOW_UP`: review completed but follow-up work remains.

Update rule:

- Mark a task `DONE` only after the requested work and relevant QA pass.
- Mark a task `REVIEWED` only after the relevant expert reviewer agent has loaded its required skill and followed its playbook.
- For milestone reviews, store the review under `docs/reviews/` and reference it here.
- Review at the end of each phase or meaningful milestone by default; do not run expert reviewer agents after every small task.
- Run reviewer agents sequentially with focused prompts and exact file lists. Time-box stalled reviewer runs and retry with narrower scope when useful.
- Run earlier focused reviews only for high-risk scientific, dependency, accessibility, renderer lifecycle, or release-readiness work.
- Update `docs/CURRENT_STATUS.md` after major epic or milestone changes.

## Epic Summary

| Epic    | Name                                    | Status      | Review   | Notes                                                                                                                                             |
| ------- | --------------------------------------- | ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| EPIC-00 | Repository Foundation                   | REVIEWED    | REVIEWED | Phase 0 baseline complete. Architecture review saved in `docs/reviews/phase-0-architecture-review.md`.                                            |
| EPIC-01 | Simulation Studio Core V1               | REVIEWED    | REVIEWED | Core V1 complete. Implementation and architecture reviews saved under `docs/reviews/`.                                                            |
| EPIC-02 | Electromagnetic Induction Specification | REVIEWED    | REVIEWED | Specification complete and reviewed in `docs/reviews/electromagnetic-induction-spec-review.md`.                                                   |
| EPIC-03 | Electromagnetic Induction Prototype     | REVIEWED    | REVIEWED | Prototype complete and reviewed by Scientific, Visual/UX, and Release QA reviewers.                                                               |
| EPIC-04 | Prototype A Release Candidate           | REVIEWED    | REVIEWED | Release-candidate package reviewed; owner testing guide, screenshots, QA gate, status, and recommendation prepared.                               |
| EPIC-05 | Meiosis Prototype                       | IN_PROGRESS | PENDING  | Specification/model/renderer/controls reviewed by Scientific, Implementation, Visual/UX, and Architecture agents; presentation mode remains next. |

## EPIC-00: Repository Foundation

| Task   | Title                                        | Status   | Review       | Notes                                                                                                            |
| ------ | -------------------------------------------- | -------- | ------------ | ---------------------------------------------------------------------------------------------------------------- |
| SS-000 | Connect repo to GitHub                       | REVIEWED | NOT_REQUIRED | Remote `origin` tracks GitHub `main`.                                                                            |
| SS-001 | Create React/TypeScript/Vite foundation      | DONE     | REVIEWED     | Fast QA and production build passed. Covered by Phase 0 architecture review.                                     |
| SS-002 | Add repository source-of-truth docs          | DONE     | REVIEWED     | `AGENTS.md`, `docs/`, and `docs/CURRENT_STATUS.md` created.                                                      |
| SS-003 | Add dependency and license policy            | DONE     | REVIEWED     | `docs/DEPENDENCY_POLICY.md`, `docs/OPEN_SOURCE_POLICY.md`, `docs/THIRD_PARTY_NOTICES.md`.                        |
| SS-004 | Add reviewer playbooks and local skill stubs | DONE     | REVIEWED     | Playbooks in `docs/reviews/playbooks/`; stubs in `.codex/skills/`.                                               |
| SS-005 | Establish QA commands                        | DONE     | REVIEWED     | `pnpm qa:fast` and `pnpm build` pass. `qa:full` has transparent placeholders for future Playwright/visual tests. |
| SS-006 | Install and document RTK                     | DONE     | NOT_REQUIRED | `rtk 0.42.0` installed locally and documented in `docs/RTK.md`.                                                  |
| SS-007 | Add Jira-style tracker                       | DONE     | NOT_REQUIRED | Tracker created and linked from `AGENTS.md`.                                                                     |

## EPIC-01: Simulation Studio Core V1

| Task   | Title                                                | Status | Review   | Notes                                                                                                                                                             |
| ------ | ---------------------------------------------------- | ------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SS-101 | Define core simulation TypeScript contract           | DONE   | REVIEWED | `src/core/simulation/types.ts` added with focused contract tests. Reviewed in Core V1 implementation review.                                                      |
| SS-102 | Implement lifecycle host                             | DONE   | REVIEWED | `SimulationHost` added with mount, error, abort, destroy, and delegation tests. Reviewed in Core V1 implementation review.                                        |
| SS-103 | Implement deterministic timing foundation            | DONE   | REVIEWED | `SimulationClock` added with play, pause, reset, deterministic step, advance, and speed tests. Reviewed in Core V1 implementation review.                         |
| SS-104 | Implement parameter definitions and validation       | DONE   | REVIEWED | Parameter definitions added for number, boolean, choice defaults, units, bounds, and validation. Reviewed in Core V1 implementation review.                       |
| SS-105 | Implement common playback controls                   | DONE   | REVIEWED | `PlaybackControls` added with interaction tests for play, pause, reset, step, disabled states, and speed. Reviewed in Core V1 implementation review.              |
| SS-106 | Implement telemetry and equation display foundations | DONE   | REVIEWED | `TelemetryPanel` and `EquationDisplay` added with formatting, empty-state, and renderer-hook tests. Reviewed in Core V1 implementation review.                    |
| SS-107 | Implement presentation mode foundation               | DONE   | REVIEWED | `PresentationShell` added with 16:9 stage, reduced presentation layout, and supporting-panel tests. Reviewed in Core V1 implementation review.                    |
| SS-108 | Implement renderer lifecycle boundary                | DONE   | REVIEWED | `RendererHost` and `RendererDisposalStack` added with lifecycle, error, destroy, and cleanup-order tests. Reviewed in Core V1 implementation review.              |
| SS-109 | Add minimal Three.js adapter only when needed        | DONE   | REVIEWED | Three.js `0.185.1` license verified as MIT; minimal adapter added with mount, render, resize, and dispose tests. Reviewed in Core V1 implementation review.       |
| SS-110 | Add graph capability required by Prototype A         | DONE   | REVIEWED | Dependency-free SVG `TimeSeriesGraph` added with accessible labels, deterministic path, domain, and empty-state tests. Reviewed in Core V1 implementation review. |
| SS-111 | Run Implementation Reviewer for Core V1              | DONE   | REVIEWED | Review saved in `docs/reviews/core-v1-implementation-review.md`; LOW ARIA ID issue fixed during review.                                                           |
| SS-112 | Run Architecture Reviewer for Core V1                | DONE   | REVIEWED | Architecture Reviewer subagent found one MEDIUM capability-contract issue; fixed and recorded in `docs/reviews/core-v1-architecture-review.md`.                   |

## EPIC-02: Electromagnetic Induction Specification

| Task   | Title                                                         | Status | Review   | Notes                                                                                                                                                                  |
| ------ | ------------------------------------------------------------- | ------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SS-201 | Choose analytically clear induction setup                     | DONE   | REVIEWED | Rotating rectangular coil in a uniform magnetic field selected in `src/simulations/electromagnetic-induction/SPEC.md`. Reviewed by Scientific and Architecture agents. |
| SS-202 | Document educational objectives and concepts                  | DONE   | REVIEWED | Flux, Faraday law, Lenz direction, and parameter concepts documented in the specification. Reviewed in spec review.                                                    |
| SS-203 | Document formulas, assumptions, units, and tolerances         | DONE   | REVIEWED | Analytical formulas, assumptions, SI units, ranges, and model-test tolerance documented. Scientific findings resolved.                                                 |
| SS-204 | Define controls, presets, telemetry, graph states, and labels | DONE   | REVIEWED | Controls, presets, telemetry, graphs, visual states, and labels documented in the specification. Reviewed in spec review.                                              |
| SS-205 | Define acceptance criteria and test cases                     | DONE   | REVIEWED | Scientific golden tests, edge cases, accessibility notes, performance concerns, and acceptance criteria documented. Reviewed in spec review.                           |
| SS-206 | Review specification for architecture/science risk            | DONE   | REVIEWED | Scientific and Architecture Reviewer subagents completed; review saved in `docs/reviews/electromagnetic-induction-spec-review.md`.                                     |

## EPIC-03: Electromagnetic Induction Prototype

| Task   | Title                                         | Status   | Review   | Notes                                                                                                                                                              |
| ------ | --------------------------------------------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| SS-301 | Implement scientific model                    | REVIEWED | REVIEWED | Pure deterministic model reviewed by Scientific Reviewer in `docs/reviews/electromagnetic-induction-prototype-scientific-review.md`.                               |
| SS-302 | Add scientific golden tests                   | REVIEWED | REVIEWED | Golden tests reviewed by Scientific Reviewer in `docs/reviews/electromagnetic-induction-prototype-scientific-review.md`.                                           |
| SS-303 | Implement Three.js visual scene               | REVIEWED | REVIEWED | Scene reviewed by Scientific and Visual/UX reviewers; orientation labels added after review.                                                                       |
| SS-304 | Implement controls, presets, and telemetry UI | REVIEWED | REVIEWED | Controls, presets, playback, and readings reviewed; reset time aligned to the spec after Scientific review.                                                        |
| SS-305 | Implement graph/telemetry behavior            | REVIEWED | REVIEWED | Model-backed graph reviewed by Scientific and Visual/UX reviewers.                                                                                                 |
| SS-306 | Implement presentation mode behavior          | REVIEWED | REVIEWED | Presentation mode reviewed by Visual/UX Reviewer; compact 1280x720 fit fix applied.                                                                                |
| SS-307 | Verify resource cleanup                       | REVIEWED | REVIEWED | Cleanup test verifies renderer destroy and resize observer disconnect; covered by release readiness checks.                                                        |
| SS-308 | Run Scientific Reviewer                       | REVIEWED | REVIEWED | Review saved in `docs/reviews/electromagnetic-induction-prototype-scientific-review.md`; LOW reset-time finding fixed, unbounded-angle note accepted as follow-up. |
| SS-309 | Run Visual / UX Reviewer                      | REVIEWED | REVIEWED | Review saved in `docs/reviews/electromagnetic-induction-prototype-visual-ux-review.md`; two MEDIUM findings resolved.                                              |
| SS-310 | Run Release QA Reviewer                       | REVIEWED | REVIEWED | Review saved in `docs/reviews/electromagnetic-induction-prototype-release-qa-review.md`; label crowding fixed, placeholder e2e/visual accepted as follow-up.       |

## EPIC-04: Prototype A Release Candidate

| Task   | Title                                    | Status   | Review       | Notes                                                                                               |
| ------ | ---------------------------------------- | -------- | ------------ | --------------------------------------------------------------------------------------------------- |
| SS-401 | Run full QA gate                         | REVIEWED | REVIEWED     | `pnpm qa:full` passed after Release QA fixes; placeholder e2e/visual scripts accepted as follow-up. |
| SS-402 | Create owner testing guide               | REVIEWED | REVIEWED     | Guide saved in `docs/user-testing/prototype-a-electromagnetic-induction.md`.                        |
| SS-403 | Capture current screenshots if supported | REVIEWED | REVIEWED     | Baseline screenshots refreshed in `docs/screenshots/prototype-a/`.                                  |
| SS-404 | Update current status and known issues   | REVIEWED | REVIEWED     | `docs/CURRENT_STATUS.md` updated for Prototype A release-candidate reviewed state.                  |
| SS-405 | Recommend next step for owner approval   | DONE     | NOT_REQUIRED | Next step is owner testing/approval; Meiosis remains parked.                                        |

## EPIC-05: Meiosis Prototype

| Task   | Title                                     | Status   | Review       | Notes                                                                                                                                  |
| ------ | ----------------------------------------- | -------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| SS-501 | Receive redirect after Prototype A        | DONE     | NOT_REQUIRED | Owner explicitly redirected work to Meiosis after Prototype A release-candidate preparation.                                           |
| SS-502 | Create Meiosis specification              | REVIEWED | REVIEWED     | Scientifically reviewed in `docs/reviews/meiosis-scientific-review.md`.                                                                |
| SS-503 | Review Meiosis specification              | REVIEWED | REVIEWED     | Scientific, Implementation, Visual/UX, and Architecture reviews completed for current scope.                                           |
| SS-504 | Implement deterministic Meiosis model     | REVIEWED | REVIEWED     | Scientific, Implementation, and Architecture reviews completed after recombination timing and Anaphase II fixes.                       |
| SS-505 | Add Meiosis scientific tests              | REVIEWED | REVIEWED     | Scientific and Implementation reviews completed after targeted regression tests passed.                                                |
| SS-506 | Implement Meiosis visual stage renderer   | REVIEWED | REVIEWED     | Scientific, Implementation, Visual/UX, and Architecture reviews completed after renderer, orientation, and layout fixes.               |
| SS-507 | Implement Meiosis controls and telemetry  | REVIEWED | REVIEWED     | Scientific, Implementation, Visual/UX, and Architecture reviews completed after orientation lock, narration, and timeline label fixes. |
| SS-508 | Implement Meiosis presentation mode       | DONE     | PENDING      | Laptop-first presentation layout implemented with shared `PresentationShell`; review will run at milestone gate unless risk rises.     |
| SS-509 | Verify Meiosis resource cleanup           | TODO     | PENDING      | Renderer or animation-loop cleanup tests as applicable.                                                                                |
| SS-510 | Run Meiosis prototype milestone reviewers | TODO     | PENDING      | Scientific, Visual / UX, and Release QA reviewers at milestone end or earlier if risk rises.                                           |
