# Electromagnetic Induction Specification

Status: Draft for review

## Educational Objective

Learners should see how a changing magnetic flux through a coil creates an induced electromotive force and current. The simulation should connect the visual motion, graph traces, equations, and Lenz direction without hiding the simplifying assumptions.

## Chosen Setup

Use a rigid rectangular coil rotating at constant angular velocity inside a uniform magnetic field.

This setup is the first prototype target because it is analytically clear:

- Magnetic flux has a closed-form expression.
- Induced EMF has a closed-form derivative.
- Current follows directly from Ohm's law.
- The sign of the induced current can be tied to Lenz direction.
- Visual state, telemetry, and graphs can all be generated from the same deterministic model.

Avoid the initial moving-magnet-through-coil setup for Prototype A because it would require a more approximate field model or a heavier numerical model to remain scientifically honest.

## Target Concepts

- Magnetic flux through a loop.
- Faraday's law of induction.
- Lenz's law as the sign/direction of induced response.
- Relationship between angular position, angular velocity, single-turn flux, flux linkage, EMF, and current.
- How parameter changes affect amplitude and phase.

## Scientific Assumptions

- The magnetic field is uniform and constant in space.
- The coil is rigid and rectangular.
- The coil rotates at externally imposed constant angular velocity.
- The coil area is constant.
- The coil resistance is constant.
- Quasi-static approximation: propagation delay and radiation are ignored.
- Self-inductance is ignored for Prototype A, so current is `emf / resistance`.
- The simulation does not model motor torque, mechanical energy input, coil heating, or back reaction.
- SI units are used internally.

## Variables And Units

| Variable                 | Meaning                                     | Unit     |
| ------------------------ | ------------------------------------------- | -------- |
| `timeS`                  | Simulation time                             | s        |
| `turns`                  | Number of coil turns                        | count    |
| `magneticFieldT`         | Uniform magnetic field magnitude            | T        |
| `coilWidthM`             | Coil width                                  | m        |
| `coilHeightM`            | Coil height                                 | m        |
| `coilAreaM2`             | Coil area, `coilWidthM * coilHeightM`       | m^2      |
| `angularVelocityRadPerS` | Coil angular velocity                       | rad/s    |
| `initialAngleRad`        | Initial angle between coil normal and field | rad      |
| `angleRad`               | Current angle between coil normal and field | rad      |
| `singleTurnFluxWb`       | Magnetic flux through one loop              | Wb       |
| `fluxLinkageWbTurns`     | Flux linkage across all turns               | Wb-turns |
| `emfV`                   | Induced electromotive force                 | V        |
| `resistanceOhm`          | Coil resistance                             | ohm      |
| `currentA`               | Induced current                             | A        |
| `directionEpsilonV`      | Display threshold for no-direction EMF      | V        |

## Formulas

Angle:

```text
angleRad = initialAngleRad + angularVelocityRadPerS * timeS
```

Area:

```text
coilAreaM2 = coilWidthM * coilHeightM
```

Single-turn magnetic flux:

```text
singleTurnFluxWb = magneticFieldT * coilAreaM2 * cos(angleRad)
```

Flux linkage:

```text
fluxLinkageWbTurns = turns * singleTurnFluxWb
```

Induced EMF:

```text
emfV = -d(fluxLinkageWbTurns) / dt
emfV = turns * magneticFieldT * coilAreaM2 * angularVelocityRadPerS * sin(angleRad)
```

Induced current:

```text
currentA = emfV / resistanceOhm
```

Lenz direction:

```text
directionEpsilonV = 1e-6 V
if emfV > directionEpsilonV: current direction is positive loop orientation
if emfV < -directionEpsilonV: current direction is negative loop orientation
if abs(emfV) <= directionEpsilonV: no meaningful induced direction
```

Sign convention:

- The magnetic field points in the positive world `z` direction in the model and visual scene.
- The coil normal is defined by the right-hand rule from the positive loop orientation.
- `angleRad = 0` means the coil normal points with the magnetic field.
- Positive current follows the right-hand-rule orientation that produces the positive coil normal.
- Negative current follows the opposite loop orientation.
- The UI must visibly label the positive field direction, coil normal, and positive current orientation so Lenz direction is not ambiguous.

## Parameter Ranges

| Parameter                | Default |             Range | Step |
| ------------------------ | ------: | ----------------: | ---: |
| `turns`                  |      20 |           1 to 80 |    1 |
| `magneticFieldT`         |     0.8 |          0 to 1.5 | 0.05 |
| `coilWidthM`             |     0.4 |        0.1 to 0.8 | 0.05 |
| `coilHeightM`            |     0.3 |        0.1 to 0.8 | 0.05 |
| `angularVelocityRadPerS` |  3.1416 | -6.2832 to 6.2832 |  0.1 |
| `initialAngleRad`        |       0 |       0 to 6.2832 |  0.1 |
| `resistanceOhm`          |      10 |          2 to 100 |  0.5 |

Zero magnetic field and zero angular velocity are allowed because they produce useful edge cases.

These ranges still describe an idealized educational model. The UI should label outputs as idealized when parameters produce large voltages or currents, because Prototype A intentionally omits coil heating, motor torque, back reaction, and energy accounting.

## Controls

- Play / pause / reset / deterministic step.
- Speed multiplier from the shared playback controls.
- Sliders or numeric inputs for magnetic field, coil dimensions, turns, angular velocity, resistance, and initial angle.
- Preset selector.
- Presentation mode toggle when the prototype UI exists.

## Presets

| Preset           | Purpose                                              |
| ---------------- | ---------------------------------------------------- |
| Slow rotation    | Easy classroom explanation of phase relationships.   |
| Strong field     | Shows increased flux, EMF, and current amplitudes.   |
| High resistance  | Shows same EMF with reduced current.                 |
| No field         | Demonstrates no induction without magnetic field.    |
| Reverse rotation | Shows sign reversal from angular velocity direction. |

## Telemetry

Show live values:

- Time `timeS`
- Angle in degrees and radians
- Single-turn flux `singleTurnFluxWb`
- Flux linkage `fluxLinkageWbTurns`
- EMF `emfV`
- Current `currentA`
- Lenz direction label

Telemetry values should be rounded for display only. Scientific tests should use unrounded model values.

## Graphs

Prototype A should include time-series graphs for:

- Single-turn flux vs time
- Flux linkage vs time
- EMF vs time
- Current vs time

The graph samples must come from model/controller state, not from renderer state.

## Visual States

- 3D rectangular coil rotating in a uniform magnetic field.
- Field arrows should be visually consistent and not imply non-uniform field strength.
- Coil normal indicator should make the angle definition clear.
- Current direction indicator should switch sign with EMF.
- EMF values with `abs(emfV) <= directionEpsilonV` should show a neutral/no-direction state.

## Animation States

- Paused: coil remains at current analytical angle.
- Playing: time advances through `SimulationClock`; model computes state deterministically.
- Step: advances by a fixed delta and updates model/graphs.
- Reset: returns time and angle to defaults or current preset's initial state.

## Edge Cases

- `magneticFieldT = 0`: single-turn flux, flux linkage, EMF, and current are zero.
- `angularVelocityRadPerS = 0`: single-turn flux and flux linkage may be nonzero, but EMF and current are zero.
- `angleRad = 0` or `pi`: single-turn flux and flux linkage magnitudes are maximal, EMF is zero.
- `angleRad = pi / 2` or `3pi / 2`: single-turn flux and flux linkage are zero, EMF magnitude is maximal.
- Negative angular velocity reverses EMF and current sign.
- Very high resistance reduces current without changing EMF.
- EMF within `directionEpsilonV` displays no meaningful induced direction.

## Scientific Test Cases

Use a numeric tolerance of `1e-9` for pure model tests unless implementation details require a documented looser tolerance.

| Case                  | Parameters                                         | Expected                                                                                            |
| --------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Zero field            | `magneticFieldT = 0`                               | `singleTurnFluxWb = 0`, `fluxLinkageWbTurns = 0`, `emfV = 0`, `currentA = 0`                        |
| Static coil           | `angularVelocityRadPerS = 0`                       | `emfV = 0`, `currentA = 0`                                                                          |
| Maximum flux          | `angleRad = 0`                                     | `singleTurnFluxWb = B * A`, `fluxLinkageWbTurns = turns * B * A`, `emfV = 0`                        |
| Zero flux / max EMF   | `angleRad = pi / 2`                                | `singleTurnFluxWb ~= 0`, `fluxLinkageWbTurns ~= 0`, `emfV = turns * B * A * angularVelocityRadPerS` |
| Reverse rotation      | same setup with `angularVelocityRadPerS` negated   | `emfV` and `currentA` signs reverse                                                                 |
| Ohm relation          | any nonzero EMF and resistance                     | `currentA = emfV / resistanceOhm`                                                                   |
| Lenz direction sign   | representative positive and negative EMF quadrants | direction label follows the right-hand-rule sign convention                                         |
| Direction threshold   | `abs(emfV) <= directionEpsilonV`                   | no meaningful induced direction                                                                     |
| Idealized high values | maximum allowed classroom range                    | values remain finite and are not clamped, overflowed, or rounded misleadingly                       |

## Accessibility Notes

- Current direction must not rely on color alone.
- Graphs need text labels and legends.
- Controls require accessible labels and units.
- Presentation mode should keep the main stage readable at 16:9.
- Reduced-motion behavior should be considered before release candidate.

## Performance Concerns

- Model calculations are cheap and deterministic.
- Graph sample windows should be bounded.
- Three.js renderer must clean up geometries, materials, renderer resources, animation loops, and event listeners.
- React state should not update at 60 FPS for every visual frame.

## Acceptance Criteria

- Model formulas are implemented in pure TypeScript without React or renderer imports.
- Scientific golden tests cover the listed cases.
- Renderer consumes snapshots and does not compute scientific behavior.
- Controls update parameters through the simulation/controller boundary.
- Telemetry, equations, and graphs all correspond to the same model state.
- Single-turn flux and flux linkage are labeled separately in telemetry, equations, tests, and graphs.
- Lenz direction follows the documented right-hand-rule sign convention.
- Neutral/no-direction display uses `directionEpsilonV`.
- Playback, reset, and deterministic step behave predictably.
- Resource cleanup is verified.
- Scientific Reviewer completes before Visual / UX Reviewer.
