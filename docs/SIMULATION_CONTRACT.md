# Simulation Contract

The core contract should stay small and capability-based. Phase 1 will define the first concrete TypeScript API while implementing the shared capabilities required by Electromagnetic Induction.

Expected concepts:

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
- declared capabilities

Every simulation does not need every feature. Optional capabilities should be declared explicitly instead of forced through inheritance.

## Boundary Rule

Scientific model code must be testable without a renderer. Renderer code receives model/controller state and displays it. UI code must not contain scattered scientific equations.
