# Codex Guide

This repository is the source of truth for Simulation Studio. Do not rely on prior chat history.

Start every significant session by reading:

- `docs/CURRENT_STATUS.md`
- `docs/PROJECT_CHARTER.md`
- `docs/ARCHITECTURE.md`
- `docs/SIMULATION_CONTRACT.md`
- `docs/QA_GATES.md`
- `docs/PROJECT_TRACKER.md`

Core rules:

- Keep scientific models deterministic and independent from rendering.
- Keep React responsible for UI and coarse app state, not 60 FPS simulation state.
- Do not copy PhET code, assets, layouts, branding, screenshots, or distinctive visual identity.
- Add dependencies only when needed, verify licenses first, and update `docs/THIRD_PARTY_NOTICES.md`.
- Treat third-party libraries as read-only dependencies. Use adapters/wrappers before considering forks.
- Before a major simulation, create a specification using `docs/ADDING_A_SIMULATION.md`.
- Run reviewer playbooks sequentially at meaningful milestones. Use `.codex/skills/` when available, otherwise follow `docs/reviews/playbooks/`.
- Update `docs/PROJECT_TRACKER.md` whenever task status or review status changes.
- Update `docs/CURRENT_STATUS.md` after major milestones.

Directory-specific rules may appear in nested `AGENTS.md` files.
