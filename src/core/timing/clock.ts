export type SimulationClockMode = "paused" | "playing";

export type SimulationClockSnapshot = {
  mode: SimulationClockMode;
  simulationTimeS: number;
  speedMultiplier: number;
};

export class SimulationClock {
  private mode: SimulationClockMode = "paused";
  private simulationTimeS = 0;
  private speedMultiplier = 1;

  getSnapshot(): SimulationClockSnapshot {
    return {
      mode: this.mode,
      simulationTimeS: this.simulationTimeS,
      speedMultiplier: this.speedMultiplier,
    };
  }

  play(): void {
    this.mode = "playing";
  }

  pause(): void {
    this.mode = "paused";
  }

  reset(): void {
    this.mode = "paused";
    this.simulationTimeS = 0;
  }

  setSpeedMultiplier(speedMultiplier: number): void {
    assertPositiveFinite(speedMultiplier, "Simulation speed multiplier");
    this.speedMultiplier = speedMultiplier;
  }

  step(deltaTimeS: number): number {
    assertPositiveFinite(deltaTimeS, "Simulation step delta time");
    this.simulationTimeS += deltaTimeS;
    return deltaTimeS;
  }

  advance(realDeltaTimeS: number): number {
    assertPositiveFinite(realDeltaTimeS, "Real delta time");

    if (this.mode !== "playing") {
      return 0;
    }

    const simulationDeltaTimeS = realDeltaTimeS * this.speedMultiplier;
    this.simulationTimeS += simulationDeltaTimeS;
    return simulationDeltaTimeS;
  }
}

function assertPositiveFinite(value: number, label: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${label} must be a positive finite number.`);
  }
}
