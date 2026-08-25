import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { SimulationRenderer } from "../../rendering/lifecycle";
import type { ElectromagneticInductionState } from "./model";
import { ElectromagneticInductionSceneView } from "./ElectromagneticInductionSceneView";

function createRenderer(): SimulationRenderer<ElectromagneticInductionState> {
  return {
    destroy: vi.fn(),
    mount: vi.fn(),
    render: vi.fn(),
    resize: vi.fn(),
  };
}

describe("ElectromagneticInductionSceneView", () => {
  it("renders a named scene region", () => {
    render(<ElectromagneticInductionSceneView createRenderer={createRenderer} />);

    expect(
      screen.getByLabelText("Electromagnetic induction 3D scene"),
    ).toBeInTheDocument();
  });
});
