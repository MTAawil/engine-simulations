# Architecture

The primary boundary is:

```text
Scientific Model -> Simulation State / Controller -> Rendering -> User Interface
```

Scientific models own equations, assumptions, units, invariants, and deterministic state transitions. Renderers display state and may interpolate visuals, but must not decide scientific behavior. React owns controls, menus, coarse app state, and user-facing layout.

## Initial Structure

- `src/app`: application shell and routing when needed.
- `src/core`: shared simulation contract, timing, parameters, and lifecycle.
- `src/science`: subject-independent scientific helpers and constants.
- `src/rendering`: PixiJS and Three.js adapters when introduced.
- `src/ui`: reusable controls, telemetry, equations, and graph UI.
- `src/simulations`: concrete simulation specifications and implementations.
- `src/shared`: small shared utilities that are not simulation-specific.

Create directories when real implementation needs them. Avoid empty architecture theater.

## Complexity Rule

Prefer obvious TypeScript and composition. Add abstractions only after they remove real duplication, protect a boundary, or express a stable contract proven by implementation.
