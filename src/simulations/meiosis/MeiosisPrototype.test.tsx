import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { MeiosisPrototype } from "./MeiosisPrototype";

describe("MeiosisPrototype", () => {
  it("renders the Meiosis stage view, controls, timeline, and telemetry", () => {
    render(<MeiosisPrototype />);

    expect(
      screen.getByRole("heading", { name: /meiosis prototype/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /interphase/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
    expect(screen.getByLabelText("Metaphase I orientation")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Meiosis readings" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: /stage timeline/i }),
    ).toBeInTheDocument();
  });

  it("steps through stages and resets to Interphase", async () => {
    const user = userEvent.setup();
    render(<MeiosisPrototype />);

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByRole("heading", { name: "Prophase I" })).toBeInTheDocument();
    expect(screen.getByText("Meiosis I")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Reset" }));

    expect(screen.getByRole("heading", { name: "Interphase" })).toBeInTheDocument();
    expect(screen.getByText("Before meiosis")).toBeInTheDocument();
  });

  it("updates crossing-over telemetry and visual labels", async () => {
    const user = userEvent.setup();
    render(<MeiosisPrototype />);

    await user.click(screen.getByLabelText("Show crossing over"));

    expect(
      screen.getByText("Crossing over is hidden for this run."),
    ).toBeInTheDocument();
    expect(screen.getByText("hidden")).toBeInTheDocument();
    expect(screen.queryByText("recombined")).not.toBeInTheDocument();
  });

  it("changes orientation from the control panel", async () => {
    const user = userEvent.setup();
    render(<MeiosisPrototype />);

    await user.selectOptions(screen.getByLabelText("Metaphase I orientation"), [
      "orientationB",
    ]);

    expect(screen.getAllByText("Orientation B").length).toBeGreaterThan(1);
  });

  it("can jump directly from the timeline", async () => {
    const user = userEvent.setup();
    render(<MeiosisPrototype />);

    await user.click(screen.getByRole("button", { name: /gametes complete/i }));

    expect(
      screen.getByRole("img", {
        name: /gametes complete meiosis stage with 4 visible cells/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Complete")).toBeInTheDocument();
  });
});
