import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { SimulationRenderer } from "../../rendering/lifecycle";
import {
  calculateElectromagneticInductionState,
  defaultElectromagneticInductionParameters,
  type ElectromagneticInductionState,
} from "./model";
import { ElectromagneticInductionSceneView } from "./ElectromagneticInductionSceneView";

function createRenderer() {
  const renderer = {
    destroy: vi.fn(),
    mount: vi.fn(),
    render: vi.fn(),
    resize: vi.fn(),
  };

  return renderer satisfies SimulationRenderer<ElectromagneticInductionState>;
}

function enableWebGLForTest() {
  vi.stubGlobal("WebGLRenderingContext", vi.fn());
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(
    (contextId: string) =>
      contextId === "webgl" || contextId === "webgl2" ? ({} as never) : null,
  );
}

describe("ElectromagneticInductionSceneView", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("renders a named scene region", () => {
    render(<ElectromagneticInductionSceneView createRenderer={createRenderer} />);

    expect(
      screen.getByLabelText("Electromagnetic induction 3D scene"),
    ).toBeInTheDocument();
    expect(screen.getByText("B field: +z")).toBeInTheDocument();
    expect(screen.getByText("Coil normal: +n")).toBeInTheDocument();
    expect(screen.getByText("Positive current")).toBeInTheDocument();
  });

  it("updates the existing renderer when model state changes", () => {
    enableWebGLForTest();
    const renderer = createRenderer();
    const createInjectedRenderer = vi.fn(() => renderer);
    const initialState = calculateElectromagneticInductionState(
      0,
      defaultElectromagneticInductionParameters,
    );
    const nextState = calculateElectromagneticInductionState(
      0.5,
      defaultElectromagneticInductionParameters,
    );

    const { rerender } = render(
      <ElectromagneticInductionSceneView
        state={initialState}
        createRenderer={createInjectedRenderer}
      />,
    );

    rerender(
      <ElectromagneticInductionSceneView
        state={nextState}
        createRenderer={createInjectedRenderer}
      />,
    );

    expect(createInjectedRenderer).toHaveBeenCalledOnce();
    expect(renderer.mount).toHaveBeenCalledOnce();
    expect(renderer.render).toHaveBeenLastCalledWith(
      expect.objectContaining({
        simulationTimeS: 0.5,
        state: nextState,
      }),
    );
  });

  it("destroys renderer resources and disconnects resize observation on unmount", () => {
    enableWebGLForTest();
    const renderer = createRenderer();
    const observe = vi.fn();
    const disconnect = vi.fn();
    const ResizeObserverStub = vi.fn(function ResizeObserverStub() {
      return {
        disconnect,
        observe,
      };
    });

    vi.stubGlobal("ResizeObserver", ResizeObserverStub);

    const { unmount } = render(
      <ElectromagneticInductionSceneView
        createRenderer={() => renderer}
        state={calculateElectromagneticInductionState(
          0,
          defaultElectromagneticInductionParameters,
        )}
      />,
    );

    unmount();

    expect(observe).toHaveBeenCalledOnce();
    expect(disconnect).toHaveBeenCalledOnce();
    expect(renderer.destroy).toHaveBeenCalledOnce();
  });
});
