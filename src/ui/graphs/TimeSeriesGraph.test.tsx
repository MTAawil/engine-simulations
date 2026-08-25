import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createTimeSeriesPath, deriveGraphDomain } from "./graphMath";
import { TimeSeriesGraph } from "./TimeSeriesGraph";

describe("TimeSeriesGraph", () => {
  it("renders an accessible SVG graph with legend labels", () => {
    render(
      <TimeSeriesGraph
        title="Induced EMF over time"
        xLabel="Time (s)"
        yLabel="EMF (V)"
        series={[
          {
            id: "emf",
            label: "Induced EMF",
            color: "#57c7b6",
            points: [
              { x: 0, y: 0 },
              { x: 1, y: 2 },
            ],
          },
        ]}
      />,
    );

    expect(
      screen.getByRole("img", { name: "Induced EMF over time" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Time (s)")).toBeInTheDocument();
    expect(screen.getByText("EMF (V)")).toBeInTheDocument();
    expect(screen.getByText("Induced EMF")).toBeInTheDocument();
  });

  it("creates deterministic paths from graph domains", () => {
    expect(
      createTimeSeriesPath(
        [
          { x: 0, y: 0 },
          { x: 10, y: 10 },
        ],
        { min: 0, max: 10 },
        { min: 0, max: 10 },
        640,
        360,
      ),
    ).toBe("M 48 320 L 624 20");
  });

  it("pads flat domains so lines remain visible", () => {
    expect(deriveGraphDomain([5, 5, 5])).toEqual({ min: 4, max: 6 });
  });

  it("renders an empty graph state", () => {
    render(
      <TimeSeriesGraph
        title="Flux graph"
        xLabel="Time"
        yLabel="Flux"
        series={[]}
        emptyMessage="Waiting for samples"
      />,
    );

    expect(screen.getByText("Waiting for samples")).toBeInTheDocument();
  });
});
