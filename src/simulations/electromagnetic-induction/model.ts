export type ElectromagneticInductionParameters = {
  turns: number;
  magneticFieldT: number;
  coilWidthM: number;
  coilHeightM: number;
  angularVelocityRadPerS: number;
  initialAngleRad: number;
  resistanceOhm: number;
  directionEpsilonV: number;
};

export type InducedCurrentDirection = "positive" | "negative" | "none";

export type ElectromagneticInductionState = {
  timeS: number;
  angleRad: number;
  coilAreaM2: number;
  singleTurnFluxWb: number;
  fluxLinkageWbTurns: number;
  emfV: number;
  currentA: number;
  inducedCurrentDirection: InducedCurrentDirection;
};

export const defaultElectromagneticInductionParameters: ElectromagneticInductionParameters =
  {
    turns: 20,
    magneticFieldT: 0.8,
    coilWidthM: 0.4,
    coilHeightM: 0.3,
    angularVelocityRadPerS: Math.PI,
    initialAngleRad: 0,
    resistanceOhm: 10,
    directionEpsilonV: 1e-6,
  };

export function calculateElectromagneticInductionState(
  timeS: number,
  parameters: ElectromagneticInductionParameters,
): ElectromagneticInductionState {
  assertValidModelInput(timeS, parameters);

  const angleRad =
    parameters.initialAngleRad + parameters.angularVelocityRadPerS * timeS;
  const coilAreaM2 = parameters.coilWidthM * parameters.coilHeightM;
  const singleTurnFluxWb = parameters.magneticFieldT * coilAreaM2 * Math.cos(angleRad);
  const fluxLinkageWbTurns = parameters.turns * singleTurnFluxWb;
  const emfV =
    parameters.turns *
    parameters.magneticFieldT *
    coilAreaM2 *
    parameters.angularVelocityRadPerS *
    Math.sin(angleRad);
  const currentA = emfV / parameters.resistanceOhm;

  return {
    timeS,
    angleRad,
    coilAreaM2,
    singleTurnFluxWb,
    fluxLinkageWbTurns,
    emfV,
    currentA,
    inducedCurrentDirection: classifyInducedCurrentDirection(
      emfV,
      parameters.directionEpsilonV,
    ),
  };
}

export function classifyInducedCurrentDirection(
  emfV: number,
  directionEpsilonV: number,
): InducedCurrentDirection {
  assertPositiveFinite(directionEpsilonV, "directionEpsilonV");

  if (emfV > directionEpsilonV) {
    return "positive";
  }

  if (emfV < -directionEpsilonV) {
    return "negative";
  }

  return "none";
}

function assertValidModelInput(
  timeS: number,
  parameters: ElectromagneticInductionParameters,
) {
  assertFiniteNumber(timeS, "timeS");
  assertPositiveInteger(parameters.turns, "turns");
  assertNonNegativeFinite(parameters.magneticFieldT, "magneticFieldT");
  assertPositiveFinite(parameters.coilWidthM, "coilWidthM");
  assertPositiveFinite(parameters.coilHeightM, "coilHeightM");
  assertFiniteNumber(parameters.angularVelocityRadPerS, "angularVelocityRadPerS");
  assertFiniteNumber(parameters.initialAngleRad, "initialAngleRad");
  assertPositiveFinite(parameters.resistanceOhm, "resistanceOhm");
  assertPositiveFinite(parameters.directionEpsilonV, "directionEpsilonV");
}

function assertFiniteNumber(value: number, label: string) {
  if (!Number.isFinite(value)) {
    throw new Error(`${label} must be finite.`);
  }
}

function assertNonNegativeFinite(value: number, label: string) {
  assertFiniteNumber(value, label);

  if (value < 0) {
    throw new Error(`${label} must not be negative.`);
  }
}

function assertPositiveFinite(value: number, label: string) {
  assertFiniteNumber(value, label);

  if (value <= 0) {
    throw new Error(`${label} must be positive.`);
  }
}

function assertPositiveInteger(value: number, label: string) {
  assertPositiveFinite(value, label);

  if (!Number.isInteger(value)) {
    throw new Error(`${label} must be an integer.`);
  }
}
