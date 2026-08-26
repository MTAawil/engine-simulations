import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { calculateMeiosisState, defaultMeiosisParameters } from "./model";
import { MeiosisStageView } from "./MeiosisStageView";

describe("MeiosisStageView", () => {
  it("renders a snapshot-driven stage summary and parent cell", () => {
    render(
      <MeiosisStageView
        state={calculateMeiosisState("prophaseI", defaultMeiosisParameters)}
      />,
    );

    expect(
      screen.getByRole("img", {
        name: /prophase i meiosis stage with 1 visible cell/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Prophase I" })).toBeInTheDocument();
    expect(screen.getByText("diploid, replicated")).toBeInTheDocument();
    expect(
      screen.getByText("2 chromatids carry exchanged segments."),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/cell 1 with 4 chromosomes/i)).toBeInTheDocument();
  });

  it("shows two haploid replicated cells after meiosis I", () => {
    render(
      <MeiosisStageView
        state={calculateMeiosisState("telophaseI", defaultMeiosisParameters)}
      />,
    );

    expect(screen.getByRole("heading", { name: "Telophase I" })).toBeInTheDocument();
    expect(screen.getByText("haploid, replicated")).toBeInTheDocument();
    expect(screen.getAllByLabelText(/cell \d with 2 chromosomes/i)).toHaveLength(2);
  });

  it("shows four haploid final products after meiosis II", () => {
    render(
      <MeiosisStageView
        state={calculateMeiosisState("gametesComplete", defaultMeiosisParameters)}
      />,
    );

    expect(
      screen.getByRole("img", {
        name: /gametes complete meiosis stage with 4 visible cells/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("haploid")).toBeInTheDocument();
    expect(screen.getAllByLabelText(/cell \d with 2 chromosomes/i)).toHaveLength(4);
  });

  it("renders recombined chromatids with text that is not color-only", () => {
    render(
      <MeiosisStageView
        state={calculateMeiosisState("prophaseI", {
          ...defaultMeiosisParameters,
          crossingOverEnabled: true,
        })}
      />,
    );

    expect(screen.getAllByText("recombined")).toHaveLength(2);
  });

  it("does not render recombination markers during Interphase", () => {
    render(
      <MeiosisStageView
        state={calculateMeiosisState("interphase", {
          ...defaultMeiosisParameters,
          crossingOverEnabled: true,
        })}
      />,
    );

    expect(
      screen.getByText("0 chromatids carry exchanged segments."),
    ).toBeInTheDocument();
    expect(screen.queryByText("recombined")).not.toBeInTheDocument();
  });

  it("uses stage-specific chromosome arrangement classes", () => {
    const { container } = render(
      <MeiosisStageView
        state={calculateMeiosisState("anaphaseI", defaultMeiosisParameters)}
      />,
    );

    expect(
      container.querySelector(".meiosis-chromosome--anaphase-i-left"),
    ).toBeInTheDocument();
    expect(
      container.querySelector(".meiosis-chromosome--anaphase-i-right"),
    ).toBeInTheDocument();
  });

  it("reflects Metaphase I orientation in Anaphase I movement classes", () => {
    const { container } = render(
      <MeiosisStageView
        state={calculateMeiosisState("anaphaseI", {
          ...defaultMeiosisParameters,
          metaphaseIOrientation: "orientationB",
        })}
      />,
    );

    expect(
      container.querySelector(
        ".meiosis-chromosome--long.meiosis-chromosome--maternal.meiosis-chromosome--anaphase-i-left",
      ),
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        ".meiosis-chromosome--short.meiosis-chromosome--paternal.meiosis-chromosome--anaphase-i-left",
      ),
    ).toBeInTheDocument();
  });

  it("shows separated chromosome bodies at Anaphase II", () => {
    const { container } = render(
      <MeiosisStageView
        state={calculateMeiosisState("anaphaseII", defaultMeiosisParameters)}
      />,
    );

    expect(screen.getByText("haploid")).toBeInTheDocument();
    expect(screen.getAllByLabelText(/cell \d with 4 chromosomes/i)).toHaveLength(2);
    expect(screen.queryByLabelText(/with sister chromatids/i)).not.toBeInTheDocument();
    expect(
      container.querySelector(".meiosis-chromosome--anaphase-ii-left"),
    ).toBeInTheDocument();
    expect(
      container.querySelector(".meiosis-chromosome--anaphase-ii-right"),
    ).toBeInTheDocument();
  });

  it("can hide chromosome labels without removing accessible names", () => {
    render(
      <MeiosisStageView
        showLabels={false}
        state={calculateMeiosisState("metaphaseI", defaultMeiosisParameters)}
      />,
    );

    expect(screen.queryByText("Long Maternal")).not.toBeInTheDocument();
    expect(screen.getByLabelText(/long maternal chromosome/i)).toBeInTheDocument();
  });

  it("uses the model snapshot cells rather than deriving product count visually", () => {
    const state = calculateMeiosisState("telophaseII", defaultMeiosisParameters);

    render(<MeiosisStageView state={state} />);

    const stage = screen.getByRole("img", {
      name: /telophase ii meiosis stage with 4 visible cells/i,
    });

    expect(within(stage).getAllByLabelText(/cell \d with 2 chromosomes/i)).toHaveLength(
      state.cells.length,
    );
  });
});
