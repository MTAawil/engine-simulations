import { describe, expect, it } from "vitest";
import {
  assertPositiveDeltaTime,
  hasSimulationCapability,
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
