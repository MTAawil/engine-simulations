# Meiosis Scientific Review

Date: 2026-08-26

Reviewer: Scientific Reviewer Agent

## Scope

- `src/simulations/meiosis/SPEC.md`
- `src/simulations/meiosis/model.ts`
- `src/simulations/meiosis/model.test.ts`
- `src/simulations/meiosis/MeiosisStageView.tsx`
- `src/simulations/meiosis/MeiosisPrototype.tsx`

## Initial Findings

### HIGH: Crossing over appeared before Prophase I

The initial model showed recombined chromatids during Interphase whenever crossing over was enabled. This conflicted with the specification, which places crossing over during Prophase I.

Resolution: fixed. Recombination is now stage-aware and appears only from Prophase I onward. Regression tests verify Interphase has zero recombined chromatids and Prophase I has exactly two when enabled.

### HIGH: Anaphase II kept sister chromatids paired

The initial model represented Anaphase II as haploid replicated cells with two chromosome bodies and four chromatids per cell. The specification says sister chromatids separate and become separate chromosome bodies at Anaphase II.

Resolution: fixed. Anaphase II now has two haploid cells with four unreplicated chromosome bodies and four chromatids per visible cell. Regression tests verify the separated state.

### HIGH: Renderer did not materially represent key stage invariants

The initial renderer consumed snapshots but showed nearly the same arrangement across pre-telophase stages, which weakened model-renderer correspondence for tetrads, metaphase alignment, and anaphase separation.

Resolution: fixed. The renderer now emits stage-specific arrangement classes for Prophase I tetrads, Metaphase I alignment, Anaphase I homolog separation, Metaphase II alignment, and Anaphase II chromatid separation. Regression tests verify stage-specific classes.

### MEDIUM: Metaphase I orientation stayed editable after Meiosis I products existed

The initial prototype allowed the orientation selector to silently rewrite downstream products after Meiosis I.

Resolution: fixed. The selector is disabled from Telophase I onward with a visible note telling the learner to reset or return before Telophase I to change orientation. Regression tests verify the locked state.

### LOW: Missing targeted scientific regression tests

The original tests did not cover recombination absence before Prophase I, final-product recombination persistence, or Anaphase II separated chromatids.

Resolution: fixed. Targeted tests were added for all noted cases.

## Verification

- Focused Meiosis tests passed after final fixes: 3 files, 29 tests.
- `pnpm qa:fast` passed after final fixes: 19 files, 106 tests.
- `pnpm build` passed with the existing known large chunk warning.

## Re-Review

First re-review resolved recombination timing, Anaphase II separation, and orientation lock findings, but kept one HIGH finding open: Metaphase I and Anaphase I renderer movement did not reflect `metaphaseIOrientation`.

Final fix: `MeiosisStageView` now carries `state.metaphaseIOrientation` into the chromosome arrangement logic. Orientation A groups maternal homologs to one side; Orientation B groups long maternal plus short paternal to one side. CSS applies the resulting left/right classes, and regression tests verify the Orientation B Anaphase I case.

Final Scientific Reviewer verdict: no new scientific findings. SS-502 through SS-507 can be marked scientifically reviewed from the scientific correctness and model-renderer correspondence perspective.
