import { describe, expect, it } from "vitest";
import {
  calculateElectromagneticInductionState,
  classifyInducedCurrentDirection,
  defaultElectromagneticInductionParameters,
  type ElectromagneticInductionParameters,
} from "./model";

const tolerance = 1e-9;

function calculate(
  overrides: Partial<ElectromagneticInductionParameters> = {},
  timeS = 0,
) {
  return calculateElectromagneticInductionState(timeS, {
    ...defaultElectromagneticInductionParameters,
    ...overrides,
  });
}

describe("electromagnetic induction model", () => {
  it("returns zero flux, EMF, and current with zero magnetic field", () => {
    const state = calculate({ magneticFieldT: 0 });

    expect(state.singleTurnFluxWb).toBe(0);
    expect(state.fluxLinkageWbTurns).toBe(0);
    expect(state.emfV).toBe(0);
    expect(state.currentA).toBe(0);
    expect(state.inducedCurrentDirection).toBe("none");
  });

  it("returns zero EMF and current for a static coil", () => {
    const state = calculate({ angularVelocityRadPerS: 0 });

    expect(state.singleTurnFluxWb).not.toBe(0);
    expect(state.fluxLinkageWbTurns).not.toBe(0);
    expect(state.emfV).toBe(0);
    expect(state.currentA).toBe(0);
  });

  it("separates single-turn flux from flux linkage at maximum flux", () => {
    const state = calculate({
      turns: 10,
      magneticFieldT: 2,
      coilWidthM: 0.5,
      coilHeightM: 0.25,
      initialAngleRad: 0,
    });

    expect(state.coilAreaM2).toBeCloseTo(0.125, 12);
    expect(state.singleTurnFluxWb).toBeCloseTo(0.25, 12);
    expect(state.fluxLinkageWbTurns).toBeCloseTo(2.5, 12);
    expect(state.emfV).toBeCloseTo(0, 12);
  });

  it("computes maximum EMF at zero flux", () => {
    const state = calculate({
      turns: 10,
      magneticFieldT: 2,
      coilWidthM: 0.5,
      coilHeightM: 0.25,
      angularVelocityRadPerS: 4,
      initialAngleRad: Math.PI / 2,
    });

    expect(state.singleTurnFluxWb).toBeCloseTo(0, 12);
    expect(state.fluxLinkageWbTurns).toBeCloseTo(0, 12);
    expect(state.emfV).toBeCloseTo(10, 12);
  });

  it("reverses EMF and current when rotation direction reverses", () => {
    const positive = calculate({
      angularVelocityRadPerS: 2,
      initialAngleRad: Math.PI / 2,
      resistanceOhm: 4,
    });
    const negative = calculate({
      angularVelocityRadPerS: -2,
      initialAngleRad: Math.PI / 2,
      resistanceOhm: 4,
    });

    expect(negative.emfV).toBeCloseTo(-positive.emfV, 12);
    expect(negative.currentA).toBeCloseTo(-positive.currentA, 12);
  });

  it("keeps current tied to Ohm relation", () => {
    const state = calculate({
      initialAngleRad: Math.PI / 2,
      resistanceOhm: 8,
    });

    expect(state.currentA).toBeCloseTo(state.emfV / 8, 12);
  });

  it("classifies Lenz direction with an explicit EMF threshold", () => {
    expect(classifyInducedCurrentDirection(2e-6, 1e-6)).toBe("positive");
    expect(classifyInducedCurrentDirection(-2e-6, 1e-6)).toBe("negative");
    expect(classifyInducedCurrentDirection(5e-7, 1e-6)).toBe("none");
  });

  it("keeps high idealized classroom-range values finite", () => {
    const state = calculate({
      turns: 80,
      magneticFieldT: 1.5,
      coilWidthM: 0.8,
      coilHeightM: 0.8,
      angularVelocityRadPerS: 2 * Math.PI,
      resistanceOhm: 2,
      initialAngleRad: Math.PI / 2,
    });

    expect(Number.isFinite(state.emfV)).toBe(true);
    expect(Number.isFinite(state.currentA)).toBe(true);
    expect(state.emfV).toBeCloseTo(482.548632, 6);
    expect(state.currentA).toBeCloseTo(241.274316, 6);
  });

  it("advances angle deterministically from time", () => {
    const state = calculate(
      {
        initialAngleRad: 0.25,
        angularVelocityRadPerS: 3,
      },
      2,
    );

    expect(state.angleRad).toBeCloseTo(6.25, 12);
  });

  it("rejects invalid parameters", () => {
    expect(() => {
      calculate({ resistanceOhm: 0 });
    }).toThrow(/resistanceOhm/);
    expect(() => {
      calculate({ turns: 2.5 });
    }).toThrow(/turns/);
    expect(() => {
      calculate({ magneticFieldT: -1 });
    }).toThrow(/magneticFieldT/);
  });

  it("matches the analytical expected value within the model tolerance", () => {
    const state = calculate({
      turns: 3,
      magneticFieldT: 0.7,
      coilWidthM: 0.2,
      coilHeightM: 0.4,
      angularVelocityRadPerS: 5,
      initialAngleRad: Math.PI / 6,
      resistanceOhm: 2,
    });

    expect(Math.abs(state.singleTurnFluxWb - 0.04849742261192858)).toBeLessThan(
      tolerance,
    );
    expect(Math.abs(state.fluxLinkageWbTurns - 0.14549226783578573)).toBeLessThan(
      tolerance,
    );
    expect(Math.abs(state.emfV - 0.42)).toBeLessThan(tolerance);
    expect(Math.abs(state.currentA - 0.21)).toBeLessThan(tolerance);
  });
});
