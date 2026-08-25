# Simulation Contract

The core contract stays small and capability-based. The first concrete TypeScript API lives in `src/core/simulation/types.ts`.

Current concepts:

- initialize
- play
- pause
- reset
- deterministic step
- destroy
- set parameter
- read current state
- load preset
- metadata
- declared capabilities:
  - `playback`
  - `deterministicStep`
  - `parameters`
  - `presets`
  - `telemetry`
  - `presentationMode`

Every simulation does not need every feature. Optional capabilities should be declared explicitly instead of forced through inheritance.

## Boundary Rule

Scientific model code must be testable without a renderer. Renderer code receives model/controller state and displays it. UI code must not contain scattered scientific equations.

## Notes

- `Simulation<TState, TParameters>` is intentionally generic so scientific state and parameter types stay specific to each simulation.
- `SimulationSnapshot<TState>` includes `simulationTimeS` to keep simulation time explicit and separate from rendering frame rate.
- `assertPositiveDeltaTime` exists as a small shared guard for deterministic stepping. More timing behavior belongs in the timing foundation task, not in the contract itself.
- `SimulationHost<TState, TParameters>` owns lifecycle state, initialization errors, abort cleanup, and safe delegation to the simulation contract.
- `SimulationClock` in `src/core/timing/clock.ts` separates real elapsed time from simulation time, supports play/pause/reset/manual step, and applies speed multipliers only when advancing during playback.
- Parameter definitions in `src/core/parameters/definitions.ts` capture number, boolean, and choice controls with explicit labels, units where needed, defaults, and validation bounds.
