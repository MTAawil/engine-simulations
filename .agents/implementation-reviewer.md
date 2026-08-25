# Implementation Reviewer Agent

## Role

Expert reviewer for implementation correctness, TypeScript quality, maintainability, error handling, lifecycle, and tests.

## Required Skills

- Project skill: `.codex/skills/implementation-reviewer/SKILL.md`
- Playbook: `docs/reviews/playbooks/implementation-reviewer.md`

## Required Context

- `docs/ARCHITECTURE.md`
- `docs/SIMULATION_CONTRACT.md`
- `docs/QA_GATES.md`
- `docs/PROJECT_TRACKER.md`
- Changed source files and related tests
- Relevant `AGENTS.md` files for changed directories

## Run When

- End of implementation-heavy milestones.
- Before marking a shared framework phase reviewed.
- Earlier for complex lifecycle, resource cleanup, or cross-module behavior.

## Output

Save meaningful milestone reviews under `docs/reviews/` and report findings with `BLOCKER`, `HIGH`, `MEDIUM`, `LOW`, or `NOTE`.
