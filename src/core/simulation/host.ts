import {
  assertPositiveDeltaTime,
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
    this.simulation.play();
    this.lifecycleState = "playing";
  }

  pause(): void {
    this.ensureUsable();
    this.simulation.pause();
    this.lifecycleState = "paused";
  }

  reset(): void {
    this.ensureUsable();
    this.simulation.reset();
    this.lifecycleState = "ready";
  }

  step(deltaTimeS: number): void {
    this.ensureUsable();
    assertPositiveDeltaTime(deltaTimeS);
    this.simulation.step(deltaTimeS);
  }

  setParameter<TKey extends keyof TParameters>(
    key: TKey,
    value: TParameters[TKey],
  ): void {
    this.ensureUsable();
    this.simulation.setParameter(key, value);
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
}

function normalizeError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  return new Error(String(error));
}
