import { describe, expect, it } from "vitest";
import {
  assertValidParameterDefinition,
  createDefaultParameters,
  type ParameterDefinition,
  validateParameterValue,
} from "./definitions";

describe("parameter definitions", () => {
  const magneticFieldParameter = {
    key: "magneticFieldT",
    label: "Magnetic field",
    kind: "number",
    unit: "T",
    min: 0,
    max: 2,
    step: 0.01,
    defaultValue: 0.5,
  } satisfies ParameterDefinition;

  it("accepts valid numeric values within explicit bounds", () => {
    expect(validateParameterValue(magneticFieldParameter, 1.2)).toEqual({
      valid: true,
    });
  });

  it("rejects numeric values outside explicit bounds", () => {
    expect(validateParameterValue(magneticFieldParameter, 3)).toEqual({
      valid: false,
      message: "Magnetic field must be between 0 and 2 T.",
    });
  });

  it("rejects invalid number definitions", () => {
    expect(() => {
      assertValidParameterDefinition({
        ...magneticFieldParameter,
        min: 2,
        max: 1,
      });
    }).toThrow(/minimum must be less than maximum/);
  });

  it("validates choice options and defaults", () => {
    const parameter = {
      key: "viewMode",
      label: "View mode",
      kind: "choice",
      defaultValue: "field",
      options: [
        { value: "field", label: "Field" },
        { value: "graph", label: "Graph" },
      ],
    } satisfies ParameterDefinition;

    expect(validateParameterValue(parameter, "graph")).toEqual({ valid: true });
    expect(validateParameterValue(parameter, "unknown")).toEqual({
      valid: false,
      message: "View mode must be one of the supported choices.",
    });
  });

  it("creates default parameter records after validating definitions", () => {
    const defaults = createDefaultParameters([
      magneticFieldParameter,
      {
        key: "showFieldLines",
        label: "Show field lines",
        kind: "boolean",
        defaultValue: true,
      },
    ] as const);

    expect(defaults).toEqual({
      magneticFieldT: 0.5,
      showFieldLines: true,
    });
  });
});
