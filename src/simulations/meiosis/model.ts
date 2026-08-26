export const meiosisStages = [
  "interphase",
  "prophaseI",
  "metaphaseI",
  "anaphaseI",
  "telophaseI",
  "prophaseII",
  "metaphaseII",
  "anaphaseII",
  "telophaseII",
  "gametesComplete",
] as const;

export type MeiosisStage = (typeof meiosisStages)[number];

export type MeiosisDivisionLabel = "preMeiosis" | "meiosisI" | "meiosisII" | "complete";

export type MetaphaseIOrientation = "orientationA" | "orientationB";

export type HomologOrigin = "maternal" | "paternal";

export type ChromosomePairId = "long" | "short";

export type PloidyLabel = "diploidReplicated" | "haploidReplicated" | "haploid";

export type MeiosisParameters = {
  crossingOverEnabled: boolean;
  metaphaseIOrientation: MetaphaseIOrientation;
  showLabels: boolean;
  showStageNarration: boolean;
};

export type ChromatidSegment = {
  origin: HomologOrigin;
  region: "proximal" | "distal";
};

export type MeiosisChromatid = {
  id: string;
  segments: readonly ChromatidSegment[];
  recombined: boolean;
};

export type MeiosisChromosome = {
  id: string;
  pairId: ChromosomePairId;
  origin: HomologOrigin;
  replicated: boolean;
  chromatids: readonly MeiosisChromatid[];
};

export type MeiosisCell = {
  id: string;
  chromosomes: readonly MeiosisChromosome[];
};

export type MeiosisState = {
  stage: MeiosisStage;
  stageIndex: number;
  divisionLabel: MeiosisDivisionLabel;
  parentPloidyN: 2;
  chromosomePairCount: 2;
  chromosomeCountPerCell: number;
  chromatidCountPerCell: number;
  daughterCellCount: number;
  crossingOverEnabled: boolean;
  metaphaseIOrientation: MetaphaseIOrientation;
  recombinedChromatidCount: number;
  ploidyLabel: PloidyLabel;
  cells: readonly MeiosisCell[];
};

export const defaultMeiosisParameters: MeiosisParameters = {
  crossingOverEnabled: true,
  metaphaseIOrientation: "orientationA",
  showLabels: true,
  showStageNarration: true,
};

export function calculateMeiosisState(
  stage: MeiosisStage,
  parameters: MeiosisParameters = defaultMeiosisParameters,
): MeiosisState {
  assertValidMeiosisParameters(parameters);

  const stageIndex = getMeiosisStageIndex(stage);
  const stageCounts = calculateStageCounts(stage);
  const cells = createCellsForStage(stage, parameters);
  const recombinedChromatidCount = parameters.crossingOverEnabled ? 2 : 0;

  return {
    stage,
    stageIndex,
    divisionLabel: classifyDivision(stage),
    parentPloidyN: 2,
    chromosomePairCount: 2,
    chromosomeCountPerCell: stageCounts.chromosomeCountPerCell,
    chromatidCountPerCell: stageCounts.chromatidCountPerCell,
    daughterCellCount: cells.length,
    crossingOverEnabled: parameters.crossingOverEnabled,
    metaphaseIOrientation: parameters.metaphaseIOrientation,
    recombinedChromatidCount,
    ploidyLabel: stageCounts.ploidyLabel,
    cells,
  };
}

export function getNextMeiosisStage(stage: MeiosisStage): MeiosisStage {
  const stageIndex = getMeiosisStageIndex(stage);
  return getStageAtIndex(Math.min(stageIndex + 1, meiosisStages.length - 1));
}

export function getPreviousMeiosisStage(stage: MeiosisStage): MeiosisStage {
  const stageIndex = getMeiosisStageIndex(stage);
  return getStageAtIndex(Math.max(stageIndex - 1, 0));
}

export function getMeiosisStageIndex(stage: MeiosisStage): number {
  const stageIndex = meiosisStages.indexOf(stage);

  if (stageIndex === -1) {
    throw new Error(`Unsupported meiosis stage: ${stage}`);
  }

  return stageIndex;
}

function getStageAtIndex(stageIndex: number): MeiosisStage {
  const stage = meiosisStages[stageIndex];

  if (!stage) {
    throw new Error(`Unsupported meiosis stage index: ${String(stageIndex)}`);
  }

  return stage;
}

function classifyDivision(stage: MeiosisStage): MeiosisDivisionLabel {
  if (stage === "interphase") {
    return "preMeiosis";
  }

  if (
    stage === "prophaseI" ||
    stage === "metaphaseI" ||
    stage === "anaphaseI" ||
    stage === "telophaseI"
  ) {
    return "meiosisI";
  }

  if (stage === "gametesComplete") {
    return "complete";
  }

  return "meiosisII";
}

function calculateStageCounts(stage: MeiosisStage): {
  chromosomeCountPerCell: number;
  chromatidCountPerCell: number;
  ploidyLabel: PloidyLabel;
} {
  if (stage === "telophaseII" || stage === "gametesComplete") {
    return {
      chromosomeCountPerCell: 2,
      chromatidCountPerCell: 2,
      ploidyLabel: "haploid",
    };
  }

  if (
    stage === "telophaseI" ||
    stage === "prophaseII" ||
    stage === "metaphaseII" ||
    stage === "anaphaseII"
  ) {
    return {
      chromosomeCountPerCell: 2,
      chromatidCountPerCell: 4,
      ploidyLabel: "haploidReplicated",
    };
  }

  return {
    chromosomeCountPerCell: 4,
    chromatidCountPerCell: 8,
    ploidyLabel: "diploidReplicated",
  };
}

function createCellsForStage(
  stage: MeiosisStage,
  parameters: MeiosisParameters,
): readonly MeiosisCell[] {
  if (stage === "telophaseII" || stage === "gametesComplete") {
    return createFinalGameteCells(parameters);
  }

  if (
    stage === "telophaseI" ||
    stage === "prophaseII" ||
    stage === "metaphaseII" ||
    stage === "anaphaseII"
  ) {
    return createMeiosisIProductCells(parameters);
  }

  return [
    {
      id: "parent-cell",
      chromosomes: [
        createReplicatedChromosome("long", "maternal", parameters, true),
        createReplicatedChromosome("long", "paternal", parameters, true),
        createReplicatedChromosome("short", "maternal", parameters, false),
        createReplicatedChromosome("short", "paternal", parameters, false),
      ],
    },
  ];
}

function createMeiosisIProductCells(
  parameters: MeiosisParameters,
): readonly MeiosisCell[] {
  const [firstProduct, secondProduct] = getMeiosisIProductOrigins(
    parameters.metaphaseIOrientation,
  );

  return [
    {
      id: "meiosis-i-product-a",
      chromosomes: firstProduct.map(({ pairId, origin }) =>
        createReplicatedChromosome(pairId, origin, parameters, pairId === "long"),
      ),
    },
    {
      id: "meiosis-i-product-b",
      chromosomes: secondProduct.map(({ pairId, origin }) =>
        createReplicatedChromosome(pairId, origin, parameters, pairId === "long"),
      ),
    },
  ];
}

function createFinalGameteCells(parameters: MeiosisParameters): readonly MeiosisCell[] {
  return createMeiosisIProductCells(parameters).flatMap((cell, cellIndex) => [
    {
      id: `gamete-${String(cellIndex + 1)}a`,
      chromosomes: cell.chromosomes.map((chromosome) =>
        createUnreplicatedChromosome(chromosome, 0),
      ),
    },
    {
      id: `gamete-${String(cellIndex + 1)}b`,
      chromosomes: cell.chromosomes.map((chromosome) =>
        createUnreplicatedChromosome(chromosome, 1),
      ),
    },
  ]);
}

function getMeiosisIProductOrigins(
  orientation: MetaphaseIOrientation,
): readonly [
  readonly { pairId: ChromosomePairId; origin: HomologOrigin }[],
  readonly { pairId: ChromosomePairId; origin: HomologOrigin }[],
] {
  if (orientation === "orientationA") {
    return [
      [
        { pairId: "long", origin: "maternal" },
        { pairId: "short", origin: "maternal" },
      ],
      [
        { pairId: "long", origin: "paternal" },
        { pairId: "short", origin: "paternal" },
      ],
    ];
  }

  return [
    [
      { pairId: "long", origin: "maternal" },
      { pairId: "short", origin: "paternal" },
    ],
    [
      { pairId: "long", origin: "paternal" },
      { pairId: "short", origin: "maternal" },
    ],
  ];
}

function createReplicatedChromosome(
  pairId: ChromosomePairId,
  origin: HomologOrigin,
  parameters: MeiosisParameters,
  includeRecombinedChromatid: boolean,
): MeiosisChromosome {
  return {
    id: `${pairId}-${origin}`,
    pairId,
    origin,
    replicated: true,
    chromatids: [0, 1].map((chromatidIndex) =>
      createChromatid({
        chromatidIndex,
        includeRecombinedSegment:
          parameters.crossingOverEnabled &&
          pairId === "long" &&
          includeRecombinedChromatid &&
          chromatidIndex === 0,
        origin,
        pairId,
      }),
    ),
  };
}

function createUnreplicatedChromosome(
  chromosome: MeiosisChromosome,
  chromatidIndex: number,
): MeiosisChromosome {
  const chromatid = chromosome.chromatids[chromatidIndex];

  if (!chromatid) {
    throw new Error(`Missing chromatid ${String(chromatidIndex)} on ${chromosome.id}.`);
  }

  return {
    id: `${chromosome.id}-single-${String(chromatidIndex)}`,
    pairId: chromosome.pairId,
    origin: chromosome.origin,
    replicated: false,
    chromatids: [chromatid],
  };
}

function createChromatid({
  chromatidIndex,
  includeRecombinedSegment,
  origin,
  pairId,
}: {
  chromatidIndex: number;
  includeRecombinedSegment: boolean;
  origin: HomologOrigin;
  pairId: ChromosomePairId;
}): MeiosisChromatid {
  const distalOrigin = includeRecombinedSegment ? oppositeOrigin(origin) : origin;

  return {
    id: `${pairId}-${origin}-chromatid-${String(chromatidIndex + 1)}`,
    segments: [
      { origin, region: "proximal" },
      { origin: distalOrigin, region: "distal" },
    ],
    recombined: distalOrigin !== origin,
  };
}

function oppositeOrigin(origin: HomologOrigin): HomologOrigin {
  return origin === "maternal" ? "paternal" : "maternal";
}

function assertValidMeiosisParameters(parameters: MeiosisParameters) {
  if (typeof parameters.crossingOverEnabled !== "boolean") {
    throw new Error("crossingOverEnabled must be a boolean.");
  }

  const metaphaseIOrientation: unknown = parameters.metaphaseIOrientation;

  if (
    metaphaseIOrientation !== "orientationA" &&
    metaphaseIOrientation !== "orientationB"
  ) {
    throw new Error("metaphaseIOrientation must be orientationA or orientationB.");
  }

  if (typeof parameters.showLabels !== "boolean") {
    throw new Error("showLabels must be a boolean.");
  }

  if (typeof parameters.showStageNarration !== "boolean") {
    throw new Error("showStageNarration must be a boolean.");
  }
}
