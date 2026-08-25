export const simulationCapabilities = [
  "playback",
  "deterministicStep",
  "parameters",
  "presets",
  "telemetry",
  "presentationMode",
] as const;

export type SimulationCapability = (typeof simulationCapabilities)[number];

export type SimulationLifecycleState =
  "idle" | "initializing" | "ready" | "playing" | "paused" | "error" | "destroyed";

export type SimulationMetadata = {
  id: string;
  title: string;
  subject: "mathematics" | "physics" | "chemistry" | "biology";
  summary: string;
  capabilities: readonly SimulationCapability[];
};

export type SimulationPreset<TParameters> = {
  id: string;
  label: string;
  parameters: Partial<TParameters>;
};

export type SimulationContext = {
  signal: AbortSignal;
};

export type SimulationSnapshot<TState> = {
  lifecycleState: SimulationLifecycleState;
  simulationTimeS: number;
  state: TState;
};

export type Simulation<TState, TParameters> = {
  readonly metadata: SimulationMetadata;
  readonly presets?: readonly SimulationPreset<TParameters>[];
  initialize(context: SimulationContext): Promise<void> | void;
  play(): void;
  pause(): void;
  reset(): void;
  step(deltaTimeS: number): void;
  destroy(): void;
  setParameter<TKey extends keyof TParameters>(
    key: TKey,
    value: TParameters[TKey],
  ): void;
  getSnapshot(): SimulationSnapshot<TState>;
  loadPreset?(presetId: string): void;
};

export function hasSimulationCapability(
  metadata: SimulationMetadata,
  capability: SimulationCapability,
): boolean {
  return metadata.capabilities.includes(capability);
}

export function assertPositiveDeltaTime(deltaTimeS: number): void {
  if (!Number.isFinite(deltaTimeS) || deltaTimeS <= 0) {
    throw new Error("Simulation step delta time must be a positive finite number.");
  }
}
