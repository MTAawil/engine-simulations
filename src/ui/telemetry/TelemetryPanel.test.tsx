import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { formatTelemetryValue } from "./formatTelemetryValue";
import { TelemetryPanel } from "./TelemetryPanel";

describe("TelemetryPanel", () => {
  it("renders formatted telemetry values with units", () => {
    render(
      <TelemetryPanel
        title="Live readings"
        data={[
          {
            id: "flux",
            label: "Magnetic flux",
            value: 0.12345,
            unit: "Wb",
            precision: 3,
          },
          {
            id: "direction",
            label: "Induced current direction",
            value: "clockwise",
          },
        ]}
      />,
    );

    expect(screen.getByRole("heading", { name: "Live readings" })).toBeInTheDocument();
    expect(screen.getByText("Magnetic flux")).toBeInTheDocument();
    expect(screen.getByText("0.123 Wb")).toBeInTheDocument();
    expect(screen.getByText("clockwise")).toBeInTheDocument();
  });

  it("supports custom formatting", () => {
    expect(
      formatTelemetryValue({
        value: true,
        unit: "state",
        format: (value) => (value ? "active" : "inactive"),
      }),
    ).toBe("active state");
  });

  it("renders a stable empty state", () => {
    render(<TelemetryPanel data={[]} emptyMessage="Waiting for model data" />);

    expect(screen.getByText("Waiting for model data")).toBeInTheDocument();
  });
});
