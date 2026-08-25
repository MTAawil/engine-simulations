import { describe, expect, it } from "vitest";
import { SimulationClock } from "./clock";

describe("SimulationClock", () => {
  it("starts paused at simulation time zero", () => {
    const clock = new SimulationClock();

    expect(clock.getSnapshot()).toEqual({
      mode: "paused",
      simulationTimeS: 0,
      speedMultiplier: 1,
    });
  });

  it("does not advance while paused", () => {
    const clock = new SimulationClock();

    expect(clock.advance(0.5)).toBe(0);
    expect(clock.getSnapshot().simulationTimeS).toBe(0);
  });

  it("advances simulation time while playing", () => {
    const clock = new SimulationClock();

    clock.play();

    expect(clock.advance(0.5)).toBe(0.5);
    expect(clock.getSnapshot()).toEqual({
      mode: "playing",
      simulationTimeS: 0.5,
      speedMultiplier: 1,
    });
  });

  it("applies speed multiplier to real elapsed time", () => {
    const clock = new SimulationClock();

    clock.setSpeedMultiplier(2);
    clock.play();

    expect(clock.advance(0.5)).toBe(1);
    expect(clock.getSnapshot().simulationTimeS).toBe(1);
  });

  it("supports deterministic manual stepping independent of play state", () => {
    const clock = new SimulationClock();

    expect(clock.step(0.25)).toBe(0.25);
    expect(clock.getSnapshot()).toEqual({
      mode: "paused",
      simulationTimeS: 0.25,
      speedMultiplier: 1,
    });
  });

  it("resets simulation time and pauses playback", () => {
    const clock = new SimulationClock();

    clock.play();
    clock.advance(1);
    clock.reset();

    expect(clock.getSnapshot()).toEqual({
      mode: "paused",
      simulationTimeS: 0,
      speedMultiplier: 1,
    });
  });

  it("rejects invalid deltas and speed multipliers", () => {
    const clock = new SimulationClock();

    expect(() => {
      clock.advance(0);
    }).toThrow(/positive finite/);
    expect(() => {
      clock.step(Number.NaN);
    }).toThrow(/positive finite/);
    expect(() => {
      clock.setSpeedMultiplier(Number.POSITIVE_INFINITY);
    }).toThrow(/positive finite/);
  });
});
