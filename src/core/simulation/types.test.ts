import { describe, expect, it } from "vitest";
import {
  assertPositiveDeltaTime,
  hasSimulationCapability,
  type Simulation,
  type SimulationMetadata,
} from "./types";

describe("simulation contract helpers", () => {
  const metadata: SimulationMetadata = {
    id: "physics-demo",
    title: "Physics Demo",
    subject: "physics",
    summary: "A focused contract test simulation.",
    capabilities: ["playback", "deterministicStep"],
  };

  it("checks declared capabilities without requiring every simulation feature", () => {
    expect(hasSimulationCapability(metadata, "playback")).toBe(true);
    expect(hasSimulationCapability(metadata, "telemetry")).toBe(false);
  });

  it("allows simulations to implement only their declared capabilities", () => {
    const staticSimulation = {
      metadata: {
        id: "static-explanation",
        title: "Static Explanation",
        subject: "physics",
        summary: "A simulation surface with no playback controls.",
        capabilities: [],
      },
      initialize: () => undefined,
      destroy: () => undefined,
      getSnapshot: () => ({
        lifecycleState: "ready",
        simulationTimeS: 0,
        state: { text: "ready" },
      }),
    } satisfies Simulation<{ text: string }, Record<string, never>>;

    expect(staticSimulation.metadata.capabilities).toEqual([]);
  });

  it("accepts positive finite time steps", () => {
    expect(() => {
      assertPositiveDeltaTime(1 / 60);
    }).not.toThrow();
  });

  it("rejects invalid deterministic step deltas", () => {
    expect(() => {
      assertPositiveDeltaTime(0);
    }).toThrow(/positive finite/);
    expect(() => {
      assertPositiveDeltaTime(Number.NaN);
    }).toThrow(/positive finite/);
    expect(() => {
      assertPositiveDeltaTime(Number.POSITIVE_INFINITY);
    }).toThrow(/positive finite/);
  });
});
