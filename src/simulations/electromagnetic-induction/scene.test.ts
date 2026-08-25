import { Mesh, MeshStandardMaterial, Vector3 } from "three";
import { describe, expect, it } from "vitest";
import {
  createElectromagneticInductionSceneObjects,
  updateElectromagneticInductionSceneObjects,
} from "./scene";
import type { ElectromagneticInductionState } from "./model";

function createState(
  overrides: Partial<ElectromagneticInductionState> = {},
): ElectromagneticInductionState {
  return {
    angleRad: Math.PI / 3,
    coilAreaM2: 0.12,
    currentA: 0.4,
    emfV: 4,
    fluxLinkageWbTurns: 1.92,
    inducedCurrentDirection: "positive",
    singleTurnFluxWb: 0.096,
    timeS: 0.5,
    ...overrides,
  };
}

function currentIndicatorHex(indicator: Mesh) {
  if (!(indicator.material instanceof MeshStandardMaterial)) {
    throw new Error("Expected current indicator to use MeshStandardMaterial.");
  }

  return `#${indicator.material.color.getHexString()}`;
}

describe("electromagnetic induction scene", () => {
  it("creates a 3D scene object set with field, coil, normal, and current indicators", () => {
    const objects = createElectromagneticInductionSceneObjects();

    expect(objects.coilGroup.name).toBe("rotating-coil");
    expect(objects.coilNormalArrow.name).toBe("coil-normal");
    expect(objects.currentArrow.name).toBe("current-direction");
    expect(objects.fieldArrows).toHaveLength(6);
    expect(
      objects.fieldArrows.every((arrow) => arrow.name === "uniform-field-arrow"),
    ).toBe(true);
  });

  it("rotates the coil from model state without computing scientific behavior", () => {
    const objects = createElectromagneticInductionSceneObjects();

    updateElectromagneticInductionSceneObjects(
      objects,
      createState({ angleRad: 1.75 }),
    );

    expect(objects.coilGroup.rotation.y).toBe(1.75);
  });

  it("shows positive current direction and color", () => {
    const objects = createElectromagneticInductionSceneObjects();

    updateElectromagneticInductionSceneObjects(
      objects,
      createState({ inducedCurrentDirection: "positive" }),
    );

    const direction = new Vector3(0, 1, 0).applyQuaternion(
      objects.currentArrow.quaternion,
    );

    expect(objects.currentArrow.visible).toBe(true);
    expect(direction.x).toBeGreaterThan(0);
    expect(currentIndicatorHex(objects.currentIndicator)).toBe("#57c7b6");
  });

  it("shows negative current direction and color", () => {
    const objects = createElectromagneticInductionSceneObjects();

    updateElectromagneticInductionSceneObjects(
      objects,
      createState({ inducedCurrentDirection: "negative" }),
    );

    const direction = new Vector3(0, 1, 0).applyQuaternion(
      objects.currentArrow.quaternion,
    );

    expect(objects.currentArrow.visible).toBe(true);
    expect(direction.x).toBeLessThan(0);
    expect(currentIndicatorHex(objects.currentIndicator)).toBe("#f07c63");
  });

  it("hides current direction when model state is neutral", () => {
    const objects = createElectromagneticInductionSceneObjects();

    updateElectromagneticInductionSceneObjects(
      objects,
      createState({ inducedCurrentDirection: "none" }),
    );

    expect(objects.currentArrow.visible).toBe(false);
    expect(currentIndicatorHex(objects.currentIndicator)).toBe("#d9e2e5");
  });
});
