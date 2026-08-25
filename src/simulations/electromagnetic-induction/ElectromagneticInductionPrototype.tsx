import { useEffect, useMemo, useState } from "react";
import type { NumberParameterDefinition } from "../../core/parameters";
import type { SimulationLifecycleState, SimulationPreset } from "../../core/simulation";
import { PlaybackControls } from "../../ui/controls";
import { TimeSeriesGraph, type GraphSeries } from "../../ui/graphs";
import { TelemetryPanel, type TelemetryDatum } from "../../ui/telemetry";
import { ElectromagneticInductionSceneView } from "./ElectromagneticInductionSceneView";
import {
  calculateElectromagneticInductionState,
  defaultElectromagneticInductionParameters,
  type ElectromagneticInductionParameters,
  type ElectromagneticInductionState,
} from "./model";

const stepDeltaTimeS = 0.1;
const graphSampleCount = 80;
const graphWindowS = 4;

type GraphMetric = "singleTurnFluxWb" | "fluxLinkageWbTurns" | "emfV" | "currentA";

const graphMetricOptions = [
  {
    id: "singleTurnFluxWb",
    label: "Single-turn flux",
    yLabel: "Flux (Wb)",
    color: "#57c7b6",
  },
  {
    id: "fluxLinkageWbTurns",
    label: "Flux linkage",
    yLabel: "Linkage (Wb-turns)",
    color: "#e6b94b",
  },
  {
    id: "emfV",
    label: "EMF",
    yLabel: "EMF (V)",
    color: "#4f8cff",
  },
  {
    id: "currentA",
    label: "Current",
    yLabel: "Current (A)",
    color: "#f47fb3",
  },
] as const satisfies readonly {
  id: GraphMetric;
  label: string;
  yLabel: string;
  color: string;
}[];

const parameterDefinitions = [
  {
    kind: "number",
    key: "turns",
    label: "Coil turns",
    unit: "turns",
    min: 1,
    max: 80,
    step: 1,
    defaultValue: defaultElectromagneticInductionParameters.turns,
  },
  {
    kind: "number",
    key: "magneticFieldT",
    label: "Magnetic field",
    unit: "T",
    min: 0,
    max: 1.5,
    step: 0.05,
    defaultValue: defaultElectromagneticInductionParameters.magneticFieldT,
  },
  {
    kind: "number",
    key: "coilWidthM",
    label: "Coil width",
    unit: "m",
    min: 0.1,
    max: 0.8,
    step: 0.05,
    defaultValue: defaultElectromagneticInductionParameters.coilWidthM,
  },
  {
    kind: "number",
    key: "coilHeightM",
    label: "Coil height",
    unit: "m",
    min: 0.1,
    max: 0.8,
    step: 0.05,
    defaultValue: defaultElectromagneticInductionParameters.coilHeightM,
  },
  {
    kind: "number",
    key: "angularVelocityRadPerS",
    label: "Angular velocity",
    unit: "rad/s",
    min: -6.28,
    max: 6.28,
    step: 0.1,
    defaultValue: defaultElectromagneticInductionParameters.angularVelocityRadPerS,
  },
  {
    kind: "number",
    key: "initialAngleRad",
    label: "Initial angle",
    unit: "rad",
    min: 0,
    max: 6.28,
    step: 0.1,
    defaultValue: defaultElectromagneticInductionParameters.initialAngleRad,
  },
  {
    kind: "number",
    key: "resistanceOhm",
    label: "Resistance",
    unit: "ohm",
    min: 2,
    max: 100,
    step: 0.5,
    defaultValue: defaultElectromagneticInductionParameters.resistanceOhm,
  },
] as const satisfies readonly (NumberParameterDefinition & {
  key: keyof ElectromagneticInductionParameters;
})[];

const presets = [
  {
    id: "slow-rotation",
    label: "Slow rotation",
    parameters: {
      angularVelocityRadPerS: 1,
      magneticFieldT: 0.8,
      resistanceOhm: 10,
    },
  },
  {
    id: "strong-field",
    label: "Strong field",
    parameters: {
      magneticFieldT: 1.5,
      angularVelocityRadPerS: Math.PI,
    },
  },
  {
    id: "high-resistance",
    label: "High resistance",
    parameters: {
      resistanceOhm: 80,
      magneticFieldT: 0.8,
    },
  },
  {
    id: "no-field",
    label: "No field",
    parameters: {
      magneticFieldT: 0,
    },
  },
  {
    id: "reverse-rotation",
    label: "Reverse rotation",
    parameters: {
      angularVelocityRadPerS: -Math.PI,
    },
  },
] as const satisfies readonly SimulationPreset<ElectromagneticInductionParameters>[];

export function ElectromagneticInductionPrototype() {
  const [parameters, setParameters] = useState<ElectromagneticInductionParameters>(
    defaultElectromagneticInductionParameters,
  );
  const [timeS, setTimeS] = useState(0.18);
  const [lifecycleState, setLifecycleState] =
    useState<SimulationLifecycleState>("ready");
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [selectedPresetId, setSelectedPresetId] = useState("default");
  const [selectedGraphMetric, setSelectedGraphMetric] = useState<GraphMetric>("emfV");

  useEffect(() => {
    if (lifecycleState !== "playing") {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeS((currentTimeS) => currentTimeS + stepDeltaTimeS * speedMultiplier);
    }, 100);

    return () => {
      window.clearInterval(timer);
    };
  }, [lifecycleState, speedMultiplier]);

  const state = useMemo(
    () => calculateElectromagneticInductionState(timeS, parameters),
    [parameters, timeS],
  );

  const telemetry = useMemo(() => createTelemetry(state), [state]);
  const selectedGraphOption = graphMetricOptions.find(
    (option) => option.id === selectedGraphMetric,
  );
  const graphSeries = useMemo(
    () => createGraphSeries(parameters, timeS, selectedGraphMetric),
    [parameters, selectedGraphMetric, timeS],
  );

  function updateParameter(
    key: keyof ElectromagneticInductionParameters,
    value: number,
  ) {
    if (!Number.isFinite(value)) {
      return;
    }

    setParameters((currentParameters) => ({
      ...currentParameters,
      [key]: key === "turns" ? Math.round(value) : value,
    }));
    setSelectedPresetId("custom");
  }

  function loadPreset(presetId: string) {
    const preset = presets.find((candidate) => candidate.id === presetId);

    setSelectedPresetId(presetId);
    setLifecycleState("paused");
    setTimeS(0.18);
    setParameters({
      ...defaultElectromagneticInductionParameters,
      ...(preset?.parameters ?? {}),
    });
  }

  return (
    <section className="prototype-workspace" aria-labelledby="prototype-title">
      <div className="prototype-stage">
        <div className="intro" aria-labelledby="prototype-title">
          <p className="eyebrow">Simulation Studio</p>
          <h1 id="prototype-title">Electromagnetic induction prototype</h1>
          <p className="lede">
            A deterministic rotating-coil model drives the scene, controls, and live
            readings from the same analytical state.
          </p>
        </div>

        <ElectromagneticInductionSceneView state={state} />

        <section className="graph-panel" aria-labelledby="graph-title">
          <div className="graph-panel__header">
            <h2 id="graph-title">Model graph</h2>
            <label>
              <span>Graph</span>
              <select
                value={selectedGraphMetric}
                onChange={(event) => {
                  setSelectedGraphMetric(event.target.value as GraphMetric);
                }}
              >
                {graphMetricOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <TimeSeriesGraph
            title={`${selectedGraphOption?.label ?? "Model"} over time`}
            xLabel="Time (s)"
            yLabel={selectedGraphOption?.yLabel ?? "Value"}
            series={graphSeries}
            height={220}
          />
        </section>
      </div>

      <aside
        className="prototype-controls"
        aria-label="Electromagnetic induction controls and readings"
      >
        <div className="control-panel">
          <div>
            <p className="eyebrow">Current phase</p>
            <h2>Controls and telemetry</h2>
          </div>

          <PlaybackControls
            lifecycleState={lifecycleState}
            speedMultiplier={speedMultiplier}
            onPlay={() => {
              setLifecycleState("playing");
            }}
            onPause={() => {
              setLifecycleState("paused");
            }}
            onReset={() => {
              setLifecycleState("ready");
              setTimeS(0.18);
            }}
            onStep={() => {
              setLifecycleState("paused");
              setTimeS((currentTimeS) => currentTimeS + stepDeltaTimeS);
            }}
            onSpeedChange={setSpeedMultiplier}
          />

          <label className="preset-select">
            <span>Preset</span>
            <select
              value={selectedPresetId}
              onChange={(event) => {
                loadPreset(event.target.value);
              }}
            >
              <option value="default">Default classroom coil</option>
              <option value="custom">Custom</option>
              {presets.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.label}
                </option>
              ))}
            </select>
          </label>

          <fieldset className="parameter-grid">
            <legend>Parameters</legend>
            {parameterDefinitions.map((definition) => (
              <ParameterControl
                key={definition.key}
                definition={definition}
                value={parameters[definition.key]}
                onChange={updateParameter}
              />
            ))}
          </fieldset>
        </div>

        <TelemetryPanel title="Live readings" data={telemetry} />
      </aside>
    </section>
  );
}

type ParameterControlProps = {
  definition: (typeof parameterDefinitions)[number];
  value: number;
  onChange: (key: keyof ElectromagneticInductionParameters, value: number) => void;
};

function ParameterControl({ definition, value, onChange }: ParameterControlProps) {
  const displayValue = definition.key === "turns" ? String(value) : value.toFixed(2);

  return (
    <div className="parameter-control">
      <label htmlFor={`${definition.key}-slider`}>
        <span>{definition.label}</span>
        <output>{displayValue}</output>
      </label>
      <input
        id={`${definition.key}-slider`}
        type="range"
        min={definition.min}
        max={definition.max}
        step={definition.step}
        value={value}
        aria-label={`${definition.label} slider`}
        onChange={(event) => {
          onChange(definition.key, event.currentTarget.valueAsNumber);
        }}
      />
      <div className="parameter-control__meta">
        <span>{definition.unit}</span>
        <input
          type="number"
          min={definition.min}
          max={definition.max}
          step={definition.step}
          value={value}
          aria-label={`${definition.label} value`}
          onChange={(event) => {
            onChange(definition.key, event.currentTarget.valueAsNumber);
          }}
        />
      </div>
    </div>
  );
}

function createTelemetry(
  state: ElectromagneticInductionState,
): readonly TelemetryDatum[] {
  const angleDegrees = (state.angleRad * 180) / Math.PI;

  return [
    {
      id: "time",
      label: "Time",
      value: state.timeS,
      unit: "s",
      precision: 2,
    },
    {
      id: "angle-degrees",
      label: "Angle",
      value: angleDegrees,
      unit: "deg",
      precision: 1,
    },
    {
      id: "angle-radians",
      label: "Angle",
      value: state.angleRad,
      unit: "rad",
      precision: 2,
    },
    {
      id: "single-turn-flux",
      label: "Single-turn flux",
      value: state.singleTurnFluxWb,
      unit: "Wb",
      precision: 3,
    },
    {
      id: "flux-linkage",
      label: "Flux linkage",
      value: state.fluxLinkageWbTurns,
      unit: "Wb-turns",
      precision: 3,
    },
    {
      id: "emf",
      label: "EMF",
      value: state.emfV,
      unit: "V",
      precision: 3,
    },
    {
      id: "current",
      label: "Current",
      value: state.currentA,
      unit: "A",
      precision: 3,
    },
    {
      id: "direction",
      label: "Lenz direction",
      value: formatDirection(state.inducedCurrentDirection),
    },
  ];
}

function createGraphSeries(
  parameters: ElectromagneticInductionParameters,
  currentTimeS: number,
  metric: GraphMetric,
): readonly GraphSeries[] {
  const metricOption = graphMetricOptions.find((option) => option.id === metric);
  const startTimeS = Math.max(0, currentTimeS - graphWindowS / 2);
  const stepS = graphWindowS / (graphSampleCount - 1);
  const points = Array.from({ length: graphSampleCount }, (_, index) => {
    const sampleTimeS = startTimeS + index * stepS;
    const sampleState = calculateElectromagneticInductionState(sampleTimeS, parameters);

    return {
      x: sampleTimeS,
      y: sampleState[metric],
    };
  });

  return [
    {
      id: metric,
      label: metricOption?.label ?? metric,
      color: metricOption?.color ?? "#57c7b6",
      points,
    },
  ];
}

function formatDirection(
  direction: ElectromagneticInductionState["inducedCurrentDirection"],
) {
  switch (direction) {
    case "positive":
      return "Positive loop orientation";
    case "negative":
      return "Negative loop orientation";
    case "none":
      return "No meaningful induced direction";
  }
}
