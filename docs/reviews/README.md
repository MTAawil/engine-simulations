# Reviews

Store meaningful milestone reviews here. Do not permanently store trivial review noise.

Reviewer agent definitions live in `.agents/`. Reviewer playbooks live in `docs/reviews/playbooks/` and may also be mirrored as project-local Codex skills under `.codex/skills/`.

Reviews must be performed through the matching expert reviewer role. The same implementation agent may prepare the code, but review records should explicitly name the reviewer agent used, load its required skill, and follow that role's playbook.

Default cadence:

- Mark normal tasks `DONE` after implementation and local QA.
- Keep review `PENDING` until the end of the phase or meaningful milestone.
- Run focused earlier reviews when risk justifies it, especially for scientific formulas, dependencies/licenses, accessibility, renderer cleanup, or release readiness.
- Mark review `REVIEWED` only after findings are resolved or explicitly accepted.
