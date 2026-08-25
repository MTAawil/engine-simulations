# Core V1 Architecture Review

Date: 2026-08-25

Reviewer agent: Architecture Reviewer subagent

Required skill loaded: `.codex/skills/architecture-reviewer/SKILL.md`

Playbook followed: `docs/reviews/playbooks/architecture-reviewer.md`

Scope:

- Core simulation contract, lifecycle host, timing, and parameter definitions.
- Shared UI foundations for playback, telemetry, equations, presentation, and graphs.
- Renderer lifecycle boundary and minimal Three.js adapter.
- Consistency with the documented model/controller/renderer/UI boundary.

## Findings

| Severity | Finding                                                                                                                                                                                                                                                                                           | Resolution                                                                                                                                                                                                                                               |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MEDIUM   | `Simulation` was not truly capability-based because the interface required playback, step, and parameter methods even when metadata capabilities did not declare those features. This conflicted with `docs/SIMULATION_CONTRACT.md` and would force no-op methods into simple/static simulations. | Resolved by splitting the contract into a small required `SimulationBase` plus optional playback, deterministic step, parameter, and preset capability groups. `SimulationHost` now checks declared support before delegating optional capability calls. |
| NOTE     | `graphMath` imports graph types from the React component file. This is type-only and local to `src/ui/graphs`, so it is acceptable for now. If graph math becomes reusable outside React UI, move graph types into a small non-component module.                                                  | Accepted as a future cleanup note.                                                                                                                                                                                                                       |

No BLOCKER or HIGH architecture findings remain open.

## Notes

- The Core V1 contract is now capability-based and small enough for the first prototype.
- Scientific model, renderer, and React UI responsibilities are still separated: model state flows toward renderers/UI through typed snapshots; renderer code does not own scientific behavior.
- Three.js is isolated behind `createThreeSceneRenderer`, which keeps the third-party rendering dependency out of simulation science code.
- The graph foundation is dependency-free and data-driven, which is appropriate until Prototype A clarifies whether a larger graphing library is justified.
- The first Electromagnetic Induction implementation should re-check these boundaries once a real model, controller, renderer, and UI are wired together.

## Verification

- `pnpm format`
- `pnpm qa:fast` passed with 12 test files and 51 tests.
- `pnpm build` passed.
