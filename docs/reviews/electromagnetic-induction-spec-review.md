# Electromagnetic Induction Specification Review

Date: 2026-08-25

Scope: `src/simulations/electromagnetic-induction/SPEC.md`

Reviewer agents:

- Scientific Reviewer subagent using `.codex/skills/scientific-reviewer/SKILL.md`
- Architecture Reviewer subagent using `.codex/skills/architecture-reviewer/SKILL.md`
- Scientific Reviewer verification subagent after fixes

## Initial Scientific Findings

| Severity | Finding                                                                                                                                                              | Resolution                                                                                                                                                     |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MEDIUM   | The spec described `fluxWb` as magnetic flux while including `turns`; scientifically that is flux linkage, not single-loop flux.                                     | Resolved by separating `singleTurnFluxWb` from `fluxLinkageWbTurns`, using flux linkage in Faraday's law, and requiring separate telemetry, graphs, and tests. |
| MEDIUM   | The Lenz/sign convention was not pinned down enough to connect EMF sign to the displayed current direction.                                                          | Resolved by defining positive field direction, coil normal, positive loop orientation, and right-hand-rule display requirements.                               |
| MEDIUM   | The original maximum parameter ranges could produce very large idealized voltages and currents while omitting heating, torque, back reaction, and energy accounting. | Resolved by narrowing classroom ranges and requiring idealized-output labeling when values are large.                                                          |
| LOW      | Near-zero EMF behavior used an unspecified display threshold.                                                                                                        | Resolved by defining `directionEpsilonV = 1e-6 V` and applying it to direction display, edge cases, tests, and acceptance criteria.                            |

## Architecture Findings

No BLOCKER, HIGH, MEDIUM, or LOW architecture findings.

Architecture notes accepted for implementation:

- Keep graph sampling and graph-window management out of the Three.js renderer.
- Avoid React 60 FPS state churn.
- Keep simulation-specific Three.js scene code local to this prototype unless a second simulation proves a reusable abstraction.

## Verification Review

The follow-up Scientific Reviewer subagent confirmed:

- Flux vs flux linkage issue is resolved.
- Sign convention issue is resolved.
- Idealized range concern is acceptably resolved for a draft spec.
- Direction threshold issue is resolved.
- No BLOCKER, HIGH, or MEDIUM scientific issues remain in the patched spec.

## Status

Specification is reviewed and ready for Prototype A implementation planning.
