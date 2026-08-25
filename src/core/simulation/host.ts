import {
  assertPositiveDeltaTime,
  hasSimulationCapability,
  type Simulation,
  type SimulationLifecycleState,
  type SimulationMetadata,
  type SimulationSnapshot,
} from "./types";

export type SimulationHostStatus = {
  lifecycleState: SimulationLifecycleState;
  error: Error | null;
};

export class SimulationHost<TState, TParameters> {
  private lifecycleState: SimulationLifecycleState = "idle";
  private error: Error | null = null;
  private abortController: AbortController | null = null;

  constructor(private readonly simulation: Simulation<TState, TParameters>) {}

  get metadata(): SimulationMetadata {
    return this.simulation.metadata;
  }

  getStatus(): SimulationHostStatus {
    return {
      lifecycleState: this.lifecycleState,
      error: this.error,
    };
  }

  async mount(): Promise<void> {
    this.ensureCanStart();
    this.lifecycleState = "initializing";
    this.error = null;
    this.abortController = new AbortController();

    try {
      await this.simulation.initialize({
        signal: this.abortController.signal,
      });

      if (this.abortController.signal.aborted) {
        this.lifecycleState = "destroyed";
        return;
      }

      this.lifecycleState = "ready";
    } catch (error) {
      this.error = normalizeError(error);
      this.lifecycleState = "error";
      throw this.error;
    }
  }

  play(): void {
    this.ensureUsable();
    const play = this.requirePlaybackMethod("play");
    play();
    this.lifecycleState = "playing";
  }

  pause(): void {
    this.ensureUsable();
    const pause = this.requirePlaybackMethod("pause");
    pause();
    this.lifecycleState = "paused";
  }

  reset(): void {
    this.ensureUsable();
    const reset = this.requirePlaybackMethod("reset");
    reset();
    this.lifecycleState = "ready";
  }

  step(deltaTimeS: number): void {
    this.ensureUsable();
    assertPositiveDeltaTime(deltaTimeS);
    const step = this.requireCapabilityMethod("deterministicStep", "step");
    step(deltaTimeS);
  }

  setParameter<TKey extends keyof TParameters>(
    key: TKey,
    value: TParameters[TKey],
  ): void {
    this.ensureUsable();
    const setParameter = this.requireCapabilityMethod("parameters", "setParameter");
    setParameter(key, value);
  }

  getSnapshot(): SimulationSnapshot<TState> {
    this.ensureUsable();
    return this.simulation.getSnapshot();
  }

  destroy(): void {
    if (this.lifecycleState === "destroyed") {
      return;
    }

    this.abortController?.abort();
    this.simulation.destroy();
    this.lifecycleState = "destroyed";
  }

  private ensureCanStart(): void {
    if (this.lifecycleState === "destroyed") {
      throw new Error("Cannot mount a destroyed simulation host.");
    }

    if (this.lifecycleState !== "idle") {
      throw new Error(`Cannot mount simulation from ${this.lifecycleState} state.`);
    }
  }

  private ensureUsable(): void {
    if (this.lifecycleState === "destroyed") {
      throw new Error("Simulation host has been destroyed.");
    }

    if (this.lifecycleState === "error") {
      throw new Error("Simulation host is in an error state.");
    }

    if (this.lifecycleState === "idle" || this.lifecycleState === "initializing") {
      throw new Error(`Simulation host is not ready: ${this.lifecycleState}.`);
    }
  }

  private requirePlaybackMethod<TKey extends "play" | "pause" | "reset">(
    methodName: TKey,
  ): NonNullable<Simulation<TState, TParameters>[TKey]> {
    return this.requireCapabilityMethod("playback", methodName);
  }

  private requireCapabilityMethod<
    TKey extends "play" | "pause" | "reset" | "step" | "setParameter",
  >(
    capability: SimulationMetadata["capabilities"][number],
    methodName: TKey,
  ): NonNullable<Simulation<TState, TParameters>[TKey]> {
    const method = this.simulation[methodName];

    if (!hasSimulationCapability(this.simulation.metadata, capability) || !method) {
      throw new Error(`Simulation does not support ${capability}.`);
    }

    return method;
  }
}

function normalizeError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  return new Error(String(error));
}
