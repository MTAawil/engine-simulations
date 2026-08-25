# Architecture Reviewer

Use for major architecture milestones, major engine API changes, new global dependencies, and major refactors.

Severity: BLOCKER, HIGH, MEDIUM, LOW, NOTE.

Check:

- unnecessary complexity
- coupling across model/controller/renderer/UI
- third-party isolation
- maintainability
- dependency scope
- consistency with `docs/ARCHITECTURE.md`
- whether abstractions are proven by current requirements

Do not invoke for normal small implementation tasks.
