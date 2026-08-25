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
- `PlaybackControls` in `src/ui/controls/PlaybackControls.tsx` provides coarse React controls for play, pause, reset, deterministic step, and speed selection without subscribing to frame-rate simulation state.
- `TelemetryPanel` and `EquationDisplay` in `src/ui/` provide typed UI foundations for model readouts and equations. Equations default to plain text and expose a renderer hook for future KaTeX-style rendering without adding that dependency early.
- `PresentationShell` in `src/ui/presentation/PresentationShell.tsx` provides a 16:9 stage layout with optional controls and supporting content. Presentation mode keeps the stage stable and hides supporting panels by default unless a simulation explicitly keeps them visible.
- `RendererHost` and `RendererDisposalStack` in `src/rendering/lifecycle/` define the mount, render, resize, destroy, and cleanup boundary for future Three.js and PixiJS adapters. Renderers consume simulation snapshots and remain responsible for releasing visual resources.
- `createThreeSceneRenderer` in `src/rendering/three/ThreeSceneRenderer.ts` is the minimal Three.js adapter. It owns DOM canvas attachment, snapshot-driven scene updates, resizing, and disposal while leaving scientific state outside the renderer.
