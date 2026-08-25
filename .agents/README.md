# Reviewer Agents

These files define the expert reviewer agents used by Simulation Studio. They are not automatically executed. Run them only when the tracker calls for a milestone review or when a high-risk task needs an early focused review.

Each agent must load its assigned project-local skill from `.codex/skills/` and follow the matching playbook in `docs/reviews/playbooks/`.

## Review Cadence

- Normal implementation tasks become `DONE` after implementation and local QA.
- Reviews happen at the end of a phase or meaningful milestone by default.
- Run an earlier focused review for high-risk scientific, dependency/license, renderer lifecycle, accessibility, or release-readiness work.
- Mark review `REVIEWED` only after the agent's findings are resolved or explicitly accepted.
