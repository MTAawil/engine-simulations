import type {
  ChromosomePairId,
  HomologOrigin,
  MeiosisCell,
  MeiosisChromatid,
  MeiosisChromosome,
  MeiosisState,
  MeiosisStage,
} from "./model";
import "./meiosis.css";

export type MeiosisStageViewProps = {
  state: MeiosisState;
  showLabels?: boolean;
};

const stageLabels = {
  interphase: "Interphase",
  prophaseI: "Prophase I",
  metaphaseI: "Metaphase I",
  anaphaseI: "Anaphase I",
  telophaseI: "Telophase I",
  prophaseII: "Prophase II",
  metaphaseII: "Metaphase II",
  anaphaseII: "Anaphase II",
  telophaseII: "Telophase II",
  gametesComplete: "Gametes complete",
} as const satisfies Record<MeiosisStage, string>;

const pairLabels = {
  long: "Long",
  short: "Short",
} as const satisfies Record<ChromosomePairId, string>;

const originLabels = {
  maternal: "Maternal",
  paternal: "Paternal",
} as const satisfies Record<HomologOrigin, string>;

export function MeiosisStageView({ state, showLabels = true }: MeiosisStageViewProps) {
  const stageLabel = stageLabels[state.stage];

  return (
    <figure
      aria-label={`${stageLabel} meiosis stage with ${String(
        state.daughterCellCount,
      )} visible cell${state.daughterCellCount === 1 ? "" : "s"}`}
      className="meiosis-stage-view"
      role="img"
    >
      <div className="meiosis-stage-view__header">
        <p className="meiosis-stage-view__eyebrow">{state.divisionLabel}</p>
        <h2>{stageLabel}</h2>
        <dl aria-label="Meiosis stage counts" className="meiosis-stage-view__counts">
          <div>
            <dt>Cells</dt>
            <dd>{state.daughterCellCount}</dd>
          </div>
          <div>
            <dt>Chromosomes / cell</dt>
            <dd>{state.chromosomeCountPerCell}</dd>
          </div>
          <div>
            <dt>Chromatids / cell</dt>
            <dd>{state.chromatidCountPerCell}</dd>
          </div>
          <div>
            <dt>Ploidy</dt>
            <dd>{formatPloidy(state.ploidyLabel)}</dd>
          </div>
        </dl>
      </div>

      <div
        className="meiosis-stage-view__cells"
        data-cell-count={state.daughterCellCount}
      >
        {state.cells.map((cell, index) => (
          <CellView
            cell={cell}
            index={index}
            key={cell.id}
            showLabels={showLabels}
            stage={state.stage}
          />
        ))}
      </div>

      <figcaption className="meiosis-stage-view__caption">
        {state.crossingOverEnabled
          ? `${String(
              state.recombinedChromatidCount,
            )} chromatids carry exchanged segments.`
          : "Crossing over is hidden for this run."}
      </figcaption>
    </figure>
  );
}

function CellView({
  cell,
  index,
  showLabels,
  stage,
}: {
  cell: MeiosisCell;
  index: number;
  showLabels: boolean;
  stage: MeiosisStage;
}) {
  return (
    <section
      aria-label={`Cell ${String(index + 1)} with ${String(
        cell.chromosomes.length,
      )} chromosomes`}
      className={`meiosis-cell meiosis-cell--${stage}`}
    >
      <div className="meiosis-cell__equator" aria-hidden="true" />
      <div className="meiosis-cell__spindle meiosis-cell__spindle--left" />
      <div className="meiosis-cell__spindle meiosis-cell__spindle--right" />

      <div className="meiosis-cell__chromosomes">
        {cell.chromosomes.map((chromosome) => (
          <ChromosomeView
            chromosome={chromosome}
            key={chromosome.id}
            showLabels={showLabels}
          />
        ))}
      </div>
    </section>
  );
}

function ChromosomeView({
  chromosome,
  showLabels,
}: {
  chromosome: MeiosisChromosome;
  showLabels: boolean;
}) {
  const chromosomeLabel = `${pairLabels[chromosome.pairId]} ${
    originLabels[chromosome.origin]
  }`;

  return (
    <div
      aria-label={`${chromosomeLabel} chromosome${
        chromosome.replicated ? " with sister chromatids" : ""
      }`}
      className={`meiosis-chromosome meiosis-chromosome--${chromosome.pairId} meiosis-chromosome--${chromosome.origin}`}
    >
      <div className="meiosis-chromosome__body">
        {chromosome.chromatids.map((chromatid) => (
          <ChromatidView chromatid={chromatid} key={chromatid.id} />
        ))}
      </div>
      {showLabels ? (
        <span className="meiosis-chromosome__label">{chromosomeLabel}</span>
      ) : null}
    </div>
  );
}

function ChromatidView({ chromatid }: { chromatid: MeiosisChromatid }) {
  return (
    <div
      className={`meiosis-chromatid${
        chromatid.recombined ? " meiosis-chromatid--recombined" : ""
      }`}
    >
      {chromatid.segments.map((segment) => (
        <span
          aria-label={`${originLabels[segment.origin]} ${segment.region} segment`}
          className={`meiosis-chromatid__segment meiosis-chromatid__segment--${segment.origin} meiosis-chromatid__segment--${segment.region}`}
          key={`${segment.region}-${segment.origin}`}
        />
      ))}
      {chromatid.recombined ? (
        <span className="meiosis-chromatid__badge">recombined</span>
      ) : null}
    </div>
  );
}

function formatPloidy(ploidyLabel: MeiosisState["ploidyLabel"]) {
  if (ploidyLabel === "diploidReplicated") {
    return "diploid, replicated";
  }

  if (ploidyLabel === "haploidReplicated") {
    return "haploid, replicated";
  }

  return "haploid";
}
