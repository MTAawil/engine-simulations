# Prototype A Owner Testing Guide: Electromagnetic Induction

Date: 2026-08-26

Scope: desktop/laptop only. Mobile layout is intentionally postponed.

## Start

Run the app locally:

```bash
pnpm install
pnpm run dev
```

Open the local Vite URL shown by the terminal.

## Test Script

1. Confirm the default view loads with:
   - a 3D rotating-coil scene
   - visible labels for `B field: +z`, `Coil normal: +n`, and `Positive current`
   - controls, parameters, graph, and live readings

2. Use playback:
   - click `Play`
   - confirm time advances
   - click `Pause`
   - click `Step`
   - click `Reset`
   - confirm reset returns time to `0.00 s`

3. Change parameters:
   - move `Magnetic field`
   - move `Angular velocity`
   - change `Resistance`
   - confirm the graph and live readings update without page reload

4. Try presets:
   - choose `No field`
   - confirm EMF and current go to `0.000`
   - choose `Reverse rotation`
   - confirm the current direction changes when motion creates induced current

5. Try graph modes:
   - switch between `Single-turn flux`, `Flux linkage`, `EMF`, and `Current`
   - confirm the graph title and y-axis label change

6. Try presentation mode:
   - click `Present`
   - confirm the scene, playback controls, graph, and live readings fit in a laptop browser window around 1280x720
   - click `Exit presentation`
   - confirm full controls return

## Acceptance Questions

- Are the scene labels understandable for teaching the sign convention?
- Do the controls feel direct enough for a classroom demonstration?
- Is the graph useful in presentation mode, or should a different graph be the default?
- Are any labels confusing or too technical for the intended learner?

## Current Known Follow-Ups

- Mobile layout is intentionally postponed.
- Automated Playwright and visual regression tests are placeholders; current visual checks are manual/browser-assisted.
- Production build warns that the main JavaScript chunk is larger than 500 kB because Three.js is bundled into the first prototype.
- Reduced-motion handling is not implemented yet; playback motion is user-initiated.

## Visual Baseline

Screenshots for this release candidate:

- `docs/screenshots/prototype-a/desktop-normal.png`
- `docs/screenshots/prototype-a/desktop-presentation.png`
