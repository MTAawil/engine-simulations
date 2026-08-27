# Meiosis Owner Testing Guide

Date: 2026-08-27

Scope: desktop/laptop only. Mobile layout is intentionally postponed.

## Start

Run the app locally:

```bash
pnpm install
pnpm run dev
```

Open the local Vite URL shown by the terminal. Use the top switcher to select `Meiosis`.

## Test Script

1. Confirm the default Meiosis view loads with:
   - the `Interphase` stage
   - one visible parent cell
   - stage controls, timeline, chromosome labels, narration, and Meiosis readings

2. Step through the stages:
   - click `Next` through Prophase I, Metaphase I, Anaphase I, Telophase I, Meiosis II, and Gametes complete
   - confirm the stage title, cell count, chromosome count, chromatid count, and ploidy readings change with the stage
   - click `Previous` and confirm the stage moves backward by one step
   - click `Reset` and confirm the view returns to `Interphase`

3. Try crossing over:
   - keep `Show crossing over` on and move to `Prophase I`
   - confirm recombined chromatids are visibly labeled and patterned
   - turn `Show crossing over` off
   - confirm recombined labels disappear and the reading changes to hidden

4. Try Metaphase I orientation:
   - select `Orientation B` before Telophase I
   - step through Anaphase I and final products
   - confirm the chromosome grouping differs from `Orientation A`
   - jump to `Telophase I` and confirm the orientation selector is locked with an explanation

5. Try labels and narration:
   - turn `Show chromosome labels` off
   - confirm the simulation remains understandable from color, pattern, and readings
   - turn `Show stage narration` off and on
   - confirm the stage explanation appears and disappears without changing the model state

6. Try presentation mode:
   - click `Present`
   - confirm the stage, timeline, stage controls, narration, and Meiosis readings fit in a laptop browser window
   - click `Next` while presenting and confirm the stage advances
   - click `Exit presentation`
   - confirm the full normal view returns

## Acceptance Questions

- Is the difference between homologous chromosomes and sister chromatids clear enough?
- Does the crossing-over display make recombination understandable without implying full molecular detail?
- Are the ploidy and chromosome/chromatid readings useful for learning?
- Is the orientation lock explanation clear after Meiosis I products exist?
- Is presentation mode usable for a teacher-led laptop demonstration?

## Current Known Follow-Ups

- Mobile layout is intentionally postponed.
- Automated Playwright and visual regression tests are placeholders; current visual checks are manual/browser-assisted.
- Production build warns that the main JavaScript chunk is larger than 500 kB because Three.js is bundled into the app for Prototype A.
- Reduced-motion handling is not implemented yet; Meiosis currently uses discrete manual stage changes.
