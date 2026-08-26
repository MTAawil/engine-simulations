import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
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
    expect(screen.getByRole("button", { name: "Present" })).toBeInTheDocument();
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

  it("toggles stage narration", async () => {
    const user = userEvent.setup();
    render(<MeiosisPrototype />);

    expect(
      screen.getByText(/DNA has replicated; homologous chromosomes/i),
    ).toBeInTheDocument();

    await user.click(screen.getByLabelText("Show stage narration"));

    expect(
      screen.queryByText(/DNA has replicated; homologous chromosomes/i),
    ).not.toBeInTheDocument();
  });

  it("changes orientation from the control panel", async () => {
    const user = userEvent.setup();
    render(<MeiosisPrototype />);

    await user.selectOptions(screen.getByLabelText("Metaphase I orientation"), [
      "orientationB",
    ]);

    expect(screen.getAllByText("Orientation B").length).toBeGreaterThan(1);
  });

  it("locks orientation after Meiosis I products exist", async () => {
    const user = userEvent.setup();
    render(<MeiosisPrototype />);

    await user.click(screen.getByRole("button", { name: "05: Telophase I" }));

    expect(
      screen.getByRole("combobox", { name: /Metaphase I orientation/i }),
    ).toBeDisabled();
    expect(
      screen.getByText("Reset or return before Telophase I to change orientation."),
    ).toBeInTheDocument();
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

  it("toggles a focused presentation layout", async () => {
    const user = userEvent.setup();
    render(<MeiosisPrototype />);

    await user.click(screen.getByRole("button", { name: "Present" }));

    expect(
      screen.getByRole("region", { name: "Meiosis prototype stage" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Exit presentation" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "03: Metaphase I" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Meiosis readings" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByRole("heading", { name: "Prophase I" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Exit presentation" }));

    expect(screen.getByRole("button", { name: "Present" })).toBeInTheDocument();
    expect(screen.getByLabelText("Metaphase I orientation")).toBeInTheDocument();
  });

  it("does not register timers or animation loops across presentation mount cycles", () => {
    const setIntervalSpy = vi.spyOn(window, "setInterval");
    const requestAnimationFrameSpy = vi.spyOn(window, "requestAnimationFrame");
    const { unmount } = render(<MeiosisPrototype />);

    fireEvent.click(screen.getByRole("button", { name: "Present" }));
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    fireEvent.click(screen.getByRole("button", { name: "Exit presentation" }));
    unmount();

    expect(setIntervalSpy).not.toHaveBeenCalled();
    expect(requestAnimationFrameSpy).not.toHaveBeenCalled();

    setIntervalSpy.mockRestore();
    requestAnimationFrameSpy.mockRestore();
  });
});
