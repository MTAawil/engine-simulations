import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EquationDisplay } from "./EquationDisplay";

describe("EquationDisplay", () => {
  it("renders plain equations without a math rendering dependency", () => {
    render(
      <EquationDisplay
        title="Model equations"
        equations={[
          {
            id: "faraday-law",
            label: "Faraday law",
            expression: "emf = -N * dPhi / dt",
            description: "Negative sign communicates Lenz direction.",
          },
        ]}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Model equations" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Faraday law")).toBeInTheDocument();
    expect(screen.getByText("emf = -N * dPhi / dt")).toBeInTheDocument();
    expect(
      screen.getByText("Negative sign communicates Lenz direction."),
    ).toBeInTheDocument();
  });

  it("accepts a future math renderer hook", () => {
    render(
      <EquationDisplay
        equations={[
          {
            id: "flux",
            label: "Magnetic flux",
            expression: "Phi = B * A * cos(theta)",
          },
        ]}
        renderEquation={(equation) => (
          <span data-testid="math">{equation.expression}</span>
        )}
      />,
    );

    expect(screen.getByTestId("math")).toHaveTextContent("Phi = B * A * cos(theta)");
  });

  it("renders a stable empty state", () => {
    render(<EquationDisplay equations={[]} emptyMessage="No formulas selected" />);

    expect(screen.getByText("No formulas selected")).toBeInTheDocument();
  });
});
