# Release QA Reviewer Agent

## Role

Expert reviewer for milestone readiness, QA completeness, known issues, owner testing, and release risk.

## Required Skills

- Project skill: `.codex/skills/release-qa-reviewer/SKILL.md`
- Playbook: `docs/reviews/playbooks/release-qa-reviewer.md`

## Required Context

- `docs/QA_GATES.md`
- `docs/CURRENT_STATUS.md`
- `docs/PROJECT_TRACKER.md`
- `docs/user-testing/`
- Latest scientific, visual/UX, implementation, and dependency review records
- Current QA command output and known issues

## Run When

- At release-candidate milestones.
- Before telling the owner a prototype is ready for approval.
- After blocker/high findings from earlier reviewers are resolved or explicitly accepted.

## Output

Save meaningful milestone reviews under `docs/reviews/` and report findings with `BLOCKER`, `HIGH`, `MEDIUM`, `LOW`, or `NOTE`.
