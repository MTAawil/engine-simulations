import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PlaybackControls } from "./PlaybackControls";

function renderControls(
  overrides: Partial<React.ComponentProps<typeof PlaybackControls>> = {},
) {
  const handlers = {
    onPlay: vi.fn(),
    onPause: vi.fn(),
    onReset: vi.fn(),
    onStep: vi.fn(),
    onSpeedChange: vi.fn(),
  };

  render(
    <PlaybackControls
      lifecycleState="ready"
      speedMultiplier={1}
      {...handlers}
      {...overrides}
    />,
  );

  return handlers;
}

describe("PlaybackControls", () => {
  it("calls playback handlers from coarse UI events", async () => {
    const user = userEvent.setup();
    const handlers = renderControls();

    await user.click(screen.getByRole("button", { name: "Play" }));
    await user.click(screen.getByRole("button", { name: "Reset" }));
    await user.click(screen.getByRole("button", { name: "Step" }));

    expect(handlers.onPlay).toHaveBeenCalledOnce();
    expect(handlers.onReset).toHaveBeenCalledOnce();
    expect(handlers.onStep).toHaveBeenCalledOnce();
  });

  it("disables play while already playing and enables pause", () => {
    renderControls({ lifecycleState: "playing" });

    expect(screen.getByRole("button", { name: "Play" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Pause" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Step" })).toBeDisabled();
  });

  it("disables all controls when the simulation is not usable", () => {
    renderControls({ lifecycleState: "error" });

    expect(screen.getByRole("button", { name: "Play" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Pause" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Reset" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Step" })).toBeDisabled();
    expect(screen.getByLabelText("Speed")).toBeDisabled();
  });

  it("emits selected speed multiplier changes", async () => {
    const user = userEvent.setup();
    const handlers = renderControls({ speedOptions: [0.5, 1, 2] });

    await user.selectOptions(screen.getByLabelText("Speed"), "2");

    expect(handlers.onSpeedChange).toHaveBeenCalledWith(2);
  });
});
