import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PresentationShell } from "./PresentationShell";

describe("PresentationShell", () => {
  it("renders the simulation stage, controls, and supporting panel in normal mode", () => {
    render(
      <PresentationShell
        title="Electromagnetic Induction"
        subtitle="Flux and induced current"
        isPresentationMode={false}
        stage={<canvas title="simulation canvas" />}
        controls={<button type="button">Play</button>}
        supportingPanel={<p>Telemetry readouts</p>}
      />,
    );

    expect(
      screen.getByRole("region", { name: "Electromagnetic Induction stage" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
    expect(screen.getByText("Telemetry readouts")).toBeInTheDocument();
  });

  it("removes supporting panel content by default in presentation mode", () => {
    render(
      <PresentationShell
        title="Induction"
        isPresentationMode
        stage={<div>Stage</div>}
        supportingPanel={<p>Detailed sidebar</p>}
      />,
    );

    expect(screen.getByText("Presentation")).toBeInTheDocument();
    expect(screen.queryByText("Detailed sidebar")).not.toBeInTheDocument();
  });

  it("can keep supporting content visible during presentation when requested", () => {
    render(
      <PresentationShell
        title="Induction"
        isPresentationMode
        stage={<div>Stage</div>}
        supportingPanel={<p>Key equations</p>}
        showSupportingPanelInPresentation
      />,
    );

    expect(screen.getByText("Key equations")).toBeInTheDocument();
  });
});
