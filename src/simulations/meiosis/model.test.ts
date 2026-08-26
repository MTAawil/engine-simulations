import { describe, expect, it } from "vitest";
import {
  calculateMeiosisState,
  defaultMeiosisParameters,
  getNextMeiosisStage,
  getPreviousMeiosisStage,
  meiosisStages,
  type MeiosisParameters,
  type MeiosisStage,
} from "./model";

function calculate(stage: MeiosisStage, overrides: Partial<MeiosisParameters> = {}) {
  return calculateMeiosisState(stage, {
    ...defaultMeiosisParameters,
    ...overrides,
  });
}

function finalProductSignature(
  overrides: Partial<MeiosisParameters> = {},
): readonly string[] {
  return calculate("gametesComplete", overrides).cells.map((cell) =>
    cell.chromosomes
      .map((chromosome) => `${chromosome.pairId}:${chromosome.origin}`)
      .join("|"),
  );
}

function getExpectedStageAtIndex(index: number): MeiosisStage {
  const stage = meiosisStages[index];

  if (!stage) {
    throw new Error(`Missing test stage at index ${String(index)}.`);
  }

  return stage;
}

describe("meiosis model", () => {
  it("starts as one diploid replicated parent cell", () => {
    const state = calculate("interphase");

    expect(state.stageIndex).toBe(0);
    expect(state.divisionLabel).toBe("preMeiosis");
    expect(state.daughterCellCount).toBe(1);
    expect(state.chromosomeCountPerCell).toBe(4);
    expect(state.chromatidCountPerCell).toBe(8);
    expect(state.ploidyLabel).toBe("diploidReplicated");
    expect(state.cells[0]?.chromosomes).toHaveLength(4);
  });

  it("does not show recombination before Prophase I", () => {
    const state = calculate("interphase", { crossingOverEnabled: true });
    const recombinedChromatids = state.cells.flatMap((cell) =>
      cell.chromosomes.flatMap((chromosome) =>
        chromosome.chromatids.filter((chromatid) => chromatid.recombined),
      ),
    );

    expect(state.recombinedChromatidCount).toBe(0);
    expect(recombinedChromatids).toHaveLength(0);
  });

  it("steps forward and backward through the fixed stage list", () => {
    expect(getNextMeiosisStage("interphase")).toBe("prophaseI");
    expect(getPreviousMeiosisStage("prophaseI")).toBe("interphase");

    for (let index = 0; index < meiosisStages.length - 1; index += 1) {
      const currentStage = getExpectedStageAtIndex(index);
      const nextStage = getExpectedStageAtIndex(index + 1);

      expect(getNextMeiosisStage(currentStage)).toBe(nextStage);
    }
  });

  it("clamps stage movement at both ends", () => {
    expect(getPreviousMeiosisStage("interphase")).toBe("interphase");
    expect(getNextMeiosisStage("gametesComplete")).toBe("gametesComplete");
  });

  it("marks exactly two recombined chromatids when crossing over is enabled", () => {
    const state = calculate("prophaseI", { crossingOverEnabled: true });
    const recombinedChromatids = state.cells.flatMap((cell) =>
      cell.chromosomes.flatMap((chromosome) =>
        chromosome.chromatids.filter((chromatid) => chromatid.recombined),
      ),
    );

    expect(state.recombinedChromatidCount).toBe(2);
    expect(recombinedChromatids).toHaveLength(2);
  });

  it("marks no recombined chromatids when crossing over is disabled", () => {
    const state = calculate("prophaseI", { crossingOverEnabled: false });
    const recombinedChromatids = state.cells.flatMap((cell) =>
      cell.chromosomes.flatMap((chromosome) =>
        chromosome.chromatids.filter((chromatid) => chromatid.recombined),
      ),
    );

    expect(state.recombinedChromatidCount).toBe(0);
    expect(recombinedChromatids).toHaveLength(0);
  });

  it("represents the reductional division after meiosis I", () => {
    const state = calculate("telophaseI");

    expect(state.divisionLabel).toBe("meiosisI");
    expect(state.daughterCellCount).toBe(2);
    expect(state.chromosomeCountPerCell).toBe(2);
    expect(state.chromatidCountPerCell).toBe(4);
    expect(state.ploidyLabel).toBe("haploidReplicated");
    expect(state.cells).toHaveLength(2);
    expect(state.cells.every((cell) => cell.chromosomes.length === 2)).toBe(true);
    expect(
      state.cells.every((cell) =>
        cell.chromosomes.every((chromosome) => chromosome.replicated),
      ),
    ).toBe(true);
  });

  it("represents four haploid products after meiosis II", () => {
    const state = calculate("gametesComplete");

    expect(state.divisionLabel).toBe("complete");
    expect(state.daughterCellCount).toBe(4);
    expect(state.chromosomeCountPerCell).toBe(2);
    expect(state.chromatidCountPerCell).toBe(2);
    expect(state.ploidyLabel).toBe("haploid");
    expect(state.cells).toHaveLength(4);
    expect(
      state.cells.every((cell) =>
        cell.chromosomes.every((chromosome) => !chromosome.replicated),
      ),
    ).toBe(true);
  });

  it("represents separated sister chromatids during Anaphase II", () => {
    const state = calculate("anaphaseII");

    expect(state.divisionLabel).toBe("meiosisII");
    expect(state.daughterCellCount).toBe(2);
    expect(state.chromosomeCountPerCell).toBe(4);
    expect(state.chromatidCountPerCell).toBe(4);
    expect(state.ploidyLabel).toBe("haploid");
    expect(
      state.cells.every((cell) =>
        cell.chromosomes.every((chromosome) => !chromosome.replicated),
      ),
    ).toBe(true);
  });

  it("carries recombined chromatids into final products after crossing over", () => {
    const state = calculate("gametesComplete", { crossingOverEnabled: true });
    const recombinedChromatids = state.cells.flatMap((cell) =>
      cell.chromosomes.flatMap((chromosome) =>
        chromosome.chromatids.filter((chromatid) => chromatid.recombined),
      ),
    );

    expect(state.recombinedChromatidCount).toBe(2);
    expect(recombinedChromatids).toHaveLength(2);
  });

  it("changes final homolog combinations from metaphase I orientation", () => {
    expect(
      finalProductSignature({ metaphaseIOrientation: "orientationA" }),
    ).not.toEqual(finalProductSignature({ metaphaseIOrientation: "orientationB" }));
  });

  it("does not replicate DNA again between meiosis I and meiosis II", () => {
    for (const stage of ["prophaseII", "metaphaseII"] as const) {
      const state = calculate(stage);

      expect(state.daughterCellCount).toBe(2);
      expect(state.chromosomeCountPerCell).toBe(2);
      expect(state.chromatidCountPerCell).toBe(4);
      expect(state.ploidyLabel).toBe("haploidReplicated");
    }
  });

  it("rejects invalid parameter values", () => {
    expect(() =>
      calculate("interphase", {
        metaphaseIOrientation: "sideways" as MeiosisParameters["metaphaseIOrientation"],
      }),
    ).toThrow(/metaphaseIOrientation/);

    expect(() =>
      calculate("interphase", {
        crossingOverEnabled: "yes" as unknown as boolean,
      }),
    ).toThrow(/crossingOverEnabled/);
  });
});
