import { act } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ElectromagneticInductionPrototype } from "./ElectromagneticInductionPrototype";

describe("ElectromagneticInductionPrototype", () => {
  it("renders controls, presets, scene, and live telemetry", () => {
    render(<ElectromagneticInductionPrototype />);

    expect(
      screen.getByRole("heading", {
        name: /electromagnetic induction prototype/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Preset")).toBeInTheDocument();
    expect(screen.getByLabelText("Magnetic field slider")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Live readings" })).toBeInTheDocument();
    expect(screen.getByText("Single-turn flux")).toBeInTheDocument();
    expect(screen.getByText("Flux linkage")).toBeInTheDocument();
    expect(screen.getByText("Lenz direction")).toBeInTheDocument();
  });

  it("updates model-backed telemetry when a parameter changes", () => {
    render(<ElectromagneticInductionPrototype />);

    fireEvent.change(screen.getByLabelText("Magnetic field value"), {
      target: { value: "0" },
    });

    expect(screen.getByText("0.000 Wb")).toBeInTheDocument();
    expect(screen.getByText("0.000 Wb-turns")).toBeInTheDocument();
    expect(screen.getAllByText("0.000 V")).toHaveLength(1);
    expect(screen.getAllByText("0.000 A")).toHaveLength(1);
    expect(screen.getByText("No meaningful induced direction")).toBeInTheDocument();
  });

  it("loads presets and resets simulation time", async () => {
    const user = userEvent.setup();
    render(<ElectromagneticInductionPrototype />);

    await user.click(screen.getByRole("button", { name: "Step" }));
    expect(screen.getByText("0.28 s")).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("Preset"), "no-field");

    expect(screen.getByText("0.18 s")).toBeInTheDocument();
    expect(screen.getByLabelText("Magnetic field value")).toHaveValue(0);
  });

  it("advances with coarse playback ticks", () => {
    vi.useFakeTimers();
    render(<ElectromagneticInductionPrototype />);

    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "Play" }));
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByText("0.48 s")).toBeInTheDocument();

    vi.useRealTimers();
  });
});
