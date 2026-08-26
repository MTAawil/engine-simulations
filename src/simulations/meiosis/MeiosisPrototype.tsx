import { useMemo, useState } from "react";
import { TelemetryPanel, type TelemetryDatum } from "../../ui/telemetry";
import { MeiosisStageView } from "./MeiosisStageView";
import {
  calculateMeiosisState,
  defaultMeiosisParameters,
  getMeiosisStageIndex,
  getNextMeiosisStage,
  getPreviousMeiosisStage,
  meiosisStages,
  type MeiosisParameters,
  type MeiosisStage,
  type MeiosisState,
} from "./model";

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

export function MeiosisPrototype() {
  const [stage, setStage] = useState<MeiosisStage>("interphase");
  const [parameters, setParameters] = useState<MeiosisParameters>(
    defaultMeiosisParameters,
  );

  const state = useMemo(
    () => calculateMeiosisState(stage, parameters),
    [parameters, stage],
  );
  const telemetry = useMemo(() => createMeiosisTelemetry(state), [state]);

  function updateParameter<TKey extends keyof MeiosisParameters>(
    key: TKey,
    value: MeiosisParameters[TKey],
  ) {
    setParameters((currentParameters) => ({
      ...currentParameters,
      [key]: value,
    }));
  }

  return (
    <main className="meiosis-prototype">
      <section className="meiosis-prototype__stage" aria-label="Meiosis prototype">
        <p className="eyebrow">Biology Prototype B</p>
        <h1>Meiosis prototype</h1>
        <p className="lede">
          Follow a simplified 2n = 4 cell as homologs pair, exchange segments, separate,
          and form four haploid products.
        </p>

        <MeiosisStageView state={state} showLabels={parameters.showLabels} />
        <StageTimeline currentStage={stage} onSelectStage={setStage} />
      </section>

      <aside className="prototype-controls" aria-label="Meiosis controls">
        <section className="control-panel">
          <h2>Stage controls</h2>
          <div className="meiosis-control-row">
            <button
              disabled={stage === "interphase"}
              onClick={() => {
                setStage((currentStage) => getPreviousMeiosisStage(currentStage));
              }}
              type="button"
            >
              Previous
            </button>
            <button
              onClick={() => {
                setStage("interphase");
              }}
              type="button"
            >
              Reset
            </button>
            <button
              disabled={stage === "gametesComplete"}
              onClick={() => {
                setStage((currentStage) => getNextMeiosisStage(currentStage));
              }}
              type="button"
            >
              Next
            </button>
          </div>

          <label className="meiosis-select-control">
            Metaphase I orientation
            <select
              value={parameters.metaphaseIOrientation}
              onChange={(event) => {
                updateParameter(
                  "metaphaseIOrientation",
                  event.target.value as MeiosisParameters["metaphaseIOrientation"],
                );
              }}
            >
              <option value="orientationA">Orientation A</option>
              <option value="orientationB">Orientation B</option>
            </select>
          </label>

          <label className="meiosis-toggle-control">
            <input
              checked={parameters.crossingOverEnabled}
              onChange={(event) => {
                updateParameter("crossingOverEnabled", event.target.checked);
              }}
              type="checkbox"
            />
            Show crossing over
          </label>

          <label className="meiosis-toggle-control">
            <input
              checked={parameters.showLabels}
              onChange={(event) => {
                updateParameter("showLabels", event.target.checked);
              }}
              type="checkbox"
            />
            Show chromosome labels
          </label>
        </section>

        <TelemetryPanel data={telemetry} title="Meiosis readings" />
      </aside>
    </main>
  );
}

function StageTimeline({
  currentStage,
  onSelectStage,
}: {
  currentStage: MeiosisStage;
  onSelectStage: (stage: MeiosisStage) => void;
}) {
  return (
    <nav aria-label="Meiosis stage timeline" className="meiosis-timeline">
      {meiosisStages.map((stage) => (
        <button
          aria-current={stage === currentStage ? "step" : undefined}
          className={stage === currentStage ? "is-current" : undefined}
          key={stage}
          onClick={() => {
            onSelectStage(stage);
          }}
          type="button"
        >
          <span>{String(getMeiosisStageIndex(stage) + 1).padStart(2, "0")}</span>
          {stageLabels[stage]}
        </button>
      ))}
    </nav>
  );
}

function createMeiosisTelemetry(state: MeiosisState): readonly TelemetryDatum[] {
  return [
    {
      id: "stage",
      label: "Stage",
      value: stageLabels[state.stage],
    },
    {
      id: "division",
      label: "Division",
      value: formatDivisionLabel(state.divisionLabel),
    },
    {
      id: "cell-count",
      label: "Visible cells",
      value: state.daughterCellCount,
      precision: 0,
    },
    {
      id: "chromosomes",
      label: "Chromosomes / cell",
      value: state.chromosomeCountPerCell,
      precision: 0,
    },
    {
      id: "chromatids",
      label: "Chromatids / cell",
      value: state.chromatidCountPerCell,
      precision: 0,
    },
    {
      id: "ploidy",
      label: "Ploidy",
      value: formatPloidy(state.ploidyLabel),
    },
    {
      id: "crossing-over",
      label: "Crossing over",
      value: state.crossingOverEnabled ? "visible" : "hidden",
    },
    {
      id: "recombined",
      label: "Recombined chromatids",
      value: state.recombinedChromatidCount,
      precision: 0,
    },
    {
      id: "orientation",
      label: "Metaphase I orientation",
      value:
        state.metaphaseIOrientation === "orientationA"
          ? "Orientation A"
          : "Orientation B",
    },
  ];
}

function formatDivisionLabel(label: MeiosisState["divisionLabel"]) {
  if (label === "preMeiosis") {
    return "Before meiosis";
  }

  if (label === "meiosisI") {
    return "Meiosis I";
  }

  if (label === "meiosisII") {
    return "Meiosis II";
  }

  return "Complete";
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
