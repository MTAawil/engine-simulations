# Meiosis Specification

Status: Draft for review

## Educational Objective

Learners should understand how one diploid parent cell produces four genetically distinct haploid cells through meiosis I and meiosis II. The simulation should make chromosome pairing, crossing over, homolog separation, sister chromatid separation, and ploidy changes visible without implying that the model covers every molecular detail.

## Chosen Setup

Use a simplified diploid cell with two homologous chromosome pairs:

- one long pair
- one short pair

Each homolog has two sister chromatids after DNA replication. The prototype will show a single deterministic meiosis run with optional controls for crossing-over visibility and metaphase I orientation.

This setup is the first biology prototype target because it is visually clear:

- Diploid and haploid states can be counted directly.
- Homologous chromosomes and sister chromatids can be distinguished.
- Crossing over can be represented as deterministic segment exchange.
- Independent assortment can be shown through homolog orientation choices.
- Meiosis I and meiosis II can be stepped through as discrete biological stages.

Avoid full genome-scale inheritance, random recombination maps, nondisjunction, mutation, spindle checkpoint dynamics, and gamete probability distributions in Prototype B. Those are better as later extensions after the core visual model is validated.

## Target Concepts

- Diploid vs haploid chromosome sets.
- Homologous chromosome pairs.
- Sister chromatids.
- DNA replication before meiosis.
- Synapsis and tetrad formation.
- Crossing over between non-sister chromatids.
- Independent assortment from metaphase I orientation.
- Reductional division in meiosis I.
- Equational division in meiosis II.
- Four haploid daughter cells with chromosome combinations that can differ from the parent homologs.

## Scientific Assumptions

- The organism is modeled as `2n = 4`, with two chromosome pairs.
- DNA replication has already occurred before prophase I in the interactive sequence.
- Chromosomes are represented as simplified visual bodies with labeled chromatids and allele-colored segments.
- Crossing over is shown as one deterministic crossover event on the long chromosome pair when enabled.
- The crossover display represents exchange between non-sister chromatids only.
- Metaphase I orientation is represented as a discrete user choice, not stochastic sampling.
- Chromosome movement is idealized and does not model kinetochore microtubule forces, checkpoint timing, cohesion proteins, or spindle mechanics.
- No nondisjunction, mutation, gene conversion, chromosomal rearrangement, or sex-specific gametogenesis is modeled in Prototype B.
- The model uses biological stage invariants rather than continuous physical equations.

## State Variables

| Variable                   | Meaning                                                         | Unit / Type |
| -------------------------- | --------------------------------------------------------------- | ----------- |
| `stage`                    | Current meiosis stage                                           | enum        |
| `stageIndex`               | Deterministic index into the ordered stage list                 | count       |
| `parentPloidyN`            | Haploid chromosome set count in parent before meiosis           | count       |
| `chromosomePairCount`      | Number of homologous pairs                                      | count       |
| `chromosomeCountPerCell`   | Number of chromosome bodies in the active cell or daughter cell | count       |
| `chromatidCountPerCell`    | Number of chromatids in the active cell or daughter cell        | count       |
| `daughterCellCount`        | Number of visible cells at the current stage                    | count       |
| `crossingOverEnabled`      | Whether deterministic crossover is visible                      | boolean     |
| `metaphaseIOrientation`    | Orientation pattern for homolog pairs at metaphase I            | enum        |
| `recombinedChromatidCount` | Number of chromatids containing exchanged segments              | count       |
| `ploidyLabel`              | Human-readable state such as diploid or haploid                 | text        |

## Stages

| Stage            | Visual Meaning                                                              | Biological Invariant                                                                                |
| ---------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Interphase       | One parent cell with replicated chromosomes shown as sister chromatid pairs | DNA has replicated; chromosome bodies are duplicated but the cell is still diploid                  |
| Prophase I       | Homologs pair into tetrads; optional crossover segments appear              | Homologous chromosomes synapse; crossing over can occur between non-sister chromatids               |
| Metaphase I      | Tetrads align at the cell equator with chosen homolog orientation           | Homolog pairs, not individual sister chromatids, determine first-division segregation               |
| Anaphase I       | Homologs separate toward opposite poles; sister chromatids stay connected   | Homologous chromosomes separate; sister chromatids remain paired                                    |
| Telophase I      | Two haploid cells are visible, each chromosome still has sister chromatids  | Cell count is two; each cell has one homolog from each pair                                         |
| Prophase II      | Two cells prepare for second division                                       | No new DNA replication occurs between meiosis I and meiosis II                                      |
| Metaphase II     | Chromosomes align individually in both cells                                | Sister chromatid pairs align for separation                                                         |
| Anaphase II      | Sister chromatids separate                                                  | Sister chromatids become separate chromosome bodies                                                 |
| Telophase II     | Four haploid cells are visible                                              | Four haploid daughter cells exist                                                                   |
| Gametes Complete | Final four products are arranged for comparison                             | Each gamete contains one chromosome from each original homologous pair, possibly mixed by crossover |

## Model Rules

The model is deterministic and stage-based.

```text
nextStage = stageList[min(stageIndex + 1, stageList.length - 1)]
previousStage = stageList[max(stageIndex - 1, 0)]
resetStage = Interphase
```

Ploidy and counts:

```text
parentPloidyN = 2
chromosomePairCount = 2
diploidChromosomeCount = chromosomePairCount * parentPloidyN = 4
replicatedChromatidCountBeforeDivision = diploidChromosomeCount * 2 = 8

after meiosis I:
daughterCellCount = 2
chromosomeCountPerCell = chromosomePairCount = 2
chromatidCountPerCell = chromosomePairCount * 2 = 4
ploidyLabel = haploid, replicated

after meiosis II:
daughterCellCount = 4
chromosomeCountPerCell = chromosomePairCount = 2
chromatidCountPerCell = chromosomePairCount = 2
ploidyLabel = haploid
```

Crossing over:

```text
if crossingOverEnabled:
  exchange one distal segment between two non-sister chromatids in the long homologous pair during Prophase I
  recombinedChromatidCount = 2
else:
  recombinedChromatidCount = 0
```

Independent assortment:

```text
metaphaseIOrientation = orientationA or orientationB
orientationA: long maternal + short maternal move together in one meiosis I product
orientationB: long maternal + short paternal move together in one meiosis I product
```

The UI may label homologs as maternal/paternal for clarity, but it should explain by state and visuals rather than implying sex-specific gamete production.

## Parameter Ranges

| Parameter               | Default        | Options                        |
| ----------------------- | -------------- | ------------------------------ |
| `crossingOverEnabled`   | `true`         | `true`, `false`                |
| `metaphaseIOrientation` | `orientationA` | `orientationA`, `orientationB` |
| `showLabels`            | `true`         | `true`, `false`                |
| `showStageNarration`    | `true`         | `true`, `false`                |
| `playbackMode`          | `manual`       | `manual`, `auto`               |

Prototype B should not expose chromosome pair count as a user parameter. Keeping `2n = 4` fixed makes the stage invariants readable and testable.

## Controls

- Next stage.
- Previous stage.
- Reset to Interphase.
- Play / pause stage animation when auto playback is enabled.
- Toggle crossing over.
- Select metaphase I orientation.
- Toggle labels.
- Enter presentation mode.

The shared playback controls may be reused for play, pause, reset, and step, but the biological model advances in stage transitions rather than continuous seconds.

## Presets

| Preset               | Purpose                                                  |
| -------------------- | -------------------------------------------------------- |
| Crossing over on     | Shows recombined chromatids and final variation.         |
| Crossing over off    | Shows independent assortment without segment exchange.   |
| Orientation A        | Shows one homolog arrangement at metaphase I.            |
| Orientation B        | Shows the alternate homolog arrangement at metaphase I.  |
| Teacher presentation | Enables labels and narration with manual stage stepping. |

## Telemetry

Show live values:

- Current stage.
- Division number: Meiosis I, Meiosis II, or complete.
- Cell count.
- Chromosome count per visible cell.
- Chromatid count per visible cell.
- Ploidy label.
- Crossing-over state.
- Recombined chromatid count.
- Metaphase I orientation.

Telemetry should use classroom language and avoid molecular certainty beyond the simplified model.

## Visual States

- Parent cell boundary.
- Two homologous chromosome pairs, long and short.
- Maternal and paternal homolog color identity.
- Sister chromatid structure.
- Tetrads during prophase I and metaphase I.
- Crossover segment exchange on non-sister chromatids when enabled.
- Spindle poles and equator as simple spatial guides.
- Two cells after meiosis I.
- Four haploid products after meiosis II.
- Final gamete comparison area.

Visual cues must not rely on color alone. Shape, labels, and segment patterns should distinguish homologs and recombined chromatids.

## Animation States

- Stage transition animations should be short and deterministic.
- Paused state holds the current stage layout.
- Manual stepping moves exactly one stage forward or backward.
- Reset returns to Interphase with current parameter choices preserved unless a preset changes them.
- Presentation mode should fit the stage diagram, controls, and key telemetry on a laptop viewport.

## Graphs

Prototype B does not need a numeric time-series graph. A stage timeline is the correct first visualization:

- ordered stage names
- current stage marker
- division boundary between meiosis I and meiosis II
- completion marker for four haploid products

If a shared graph component is reused, it should represent stage progression, not invented biological numeric data.

## Edge Cases

- Crossing over disabled: no recombined segments appear, final gametes still differ when orientation produces different homolog combinations.
- Orientation changed before metaphase I: downstream product labels update deterministically.
- Orientation changed after meiosis I: either reset to metaphase I or show an explicit disabled state; do not silently rewrite final products.
- Previous at Interphase: remains at Interphase.
- Next at Gametes Complete: remains complete.
- Reset after completion: returns to Interphase with current preset parameters.
- Labels hidden: chromosome identity remains distinguishable by shape or pattern.

## Scientific Test Cases

Use deterministic model tests for stage transitions and invariants.

| Case                             | Setup                             | Expected                                                                  |
| -------------------------------- | --------------------------------- | ------------------------------------------------------------------------- |
| Initial state                    | default parameters                | stage is Interphase; one diploid parent cell; replicated chromatids shown |
| Step forward                     | any non-final stage               | stage index increments by exactly one                                     |
| Step backward                    | any non-initial stage             | stage index decrements by exactly one                                     |
| Clamp previous                   | Interphase                        | previous keeps stage at Interphase                                        |
| Clamp next                       | Gametes Complete                  | next keeps stage at Gametes Complete                                      |
| Prophase I crossover on          | crossing over enabled             | exactly two recombined chromatids are marked                              |
| Prophase I crossover off         | crossing over disabled            | no recombined chromatids are marked                                       |
| After meiosis I                  | Telophase I                       | two haploid cells, each with two replicated chromosomes                   |
| After meiosis II                 | Gametes Complete                  | four haploid cells, each with two unreplicated chromosomes                |
| Orientation A vs B               | alternate metaphase I orientation | final homolog combinations differ deterministically                       |
| No replication between divisions | Prophase II through Metaphase II  | chromatid count does not double again                                     |

## Accessibility Notes

- Stage controls require accessible names.
- Chromosome labels must be readable in laptop view.
- Recombination should use labels or patterns in addition to color.
- The stage timeline should expose the current stage in text.
- Presentation mode must keep the key stage, cell count, ploidy, and controls visible.
- Reduced-motion mode should shorten or disable transition animations while preserving stage changes.

## Performance Concerns

- The model is small and should be pure TypeScript.
- Rendering can be SVG, Canvas, or Three.js, but the first implementation should choose the simplest renderer that gives clear chromosome movement.
- React should own stage controls and parameters, not per-frame animation state.
- Animation loops must clean up on unmount.
- Layout should target desktop/laptop first; mobile is intentionally postponed.

## Acceptance Criteria

- Specification exists before implementation.
- Model is pure TypeScript with deterministic stage transitions and no React or renderer imports.
- Scientific tests cover stage order, ploidy, chromosome counts, crossover toggles, orientation outcomes, and boundary behavior.
- Renderer consumes model snapshots and does not decide biological behavior.
- UI exposes next, previous, reset, crossing-over toggle, orientation selector, labels, telemetry, and presentation mode.
- Visual states distinguish homologs, sister chromatids, recombined chromatids, haploid products, and division stages.
- Stage timeline reflects current stage and division boundary.
- Accessibility basics are covered for controls, labels, timeline, and non-color visual distinctions.
- Resource cleanup is verified for any renderer or animation loop.
- Scientific Reviewer completes before Visual / UX Reviewer.
