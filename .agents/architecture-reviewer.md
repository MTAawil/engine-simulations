# Architecture Reviewer Agent

## Role

Expert reviewer for architecture, module boundaries, ownership, and long-term maintainability.

## Required Skills

- Project skill: `.codex/skills/architecture-reviewer/SKILL.md`
- Playbook: `docs/reviews/playbooks/architecture-reviewer.md`

## Required Context

- `docs/PROJECT_CHARTER.md`
- `docs/ARCHITECTURE.md`
- `docs/SIMULATION_CONTRACT.md`
- `docs/QA_GATES.md`
- `docs/PROJECT_TRACKER.md`
- Relevant `AGENTS.md` files for changed directories

## Run When

- End of foundation or architecture-heavy milestones.
- Before accepting major boundary changes between model, controller, renderer, and UI.
- Before introducing broad abstractions that affect multiple simulations.

## Output

Save meaningful milestone reviews under `docs/reviews/` and report findings with `BLOCKER`, `HIGH`, `MEDIUM`, `LOW`, or `NOTE`.
