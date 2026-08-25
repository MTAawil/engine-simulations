export type ParameterKind = "number" | "boolean" | "choice";

export type ParameterBase<TValue> = {
  key: string;
  label: string;
  description?: string;
  defaultValue: TValue;
};

export type NumberParameterDefinition = ParameterBase<number> & {
  kind: "number";
  unit?: string;
  min: number;
  max: number;
  step?: number;
};

export type BooleanParameterDefinition = ParameterBase<boolean> & {
  kind: "boolean";
};

export type ChoiceParameterOption<TValue extends string = string> = {
  value: TValue;
  label: string;
};

export type ChoiceParameterDefinition<TValue extends string = string> =
  ParameterBase<TValue> & {
    kind: "choice";
    options: readonly ChoiceParameterOption<TValue>[];
  };

export type ParameterDefinition =
  NumberParameterDefinition | BooleanParameterDefinition | ChoiceParameterDefinition;

export type ParameterValue<TDefinition extends ParameterDefinition> =
  TDefinition extends NumberParameterDefinition
    ? number
    : TDefinition extends BooleanParameterDefinition
      ? boolean
      : TDefinition extends ChoiceParameterDefinition<infer TValue>
        ? TValue
        : never;

export type ParameterValidationResult =
  { valid: true } | { valid: false; message: string };

export function validateParameterValue(
  definition: ParameterDefinition,
  value: unknown,
): ParameterValidationResult {
  switch (definition.kind) {
    case "number":
      return validateNumberParameter(definition, value);
    case "boolean":
      return typeof value === "boolean"
        ? { valid: true }
        : invalid(`${definition.label} must be true or false.`);
    case "choice":
      return definition.options.some((option) => option.value === value)
        ? { valid: true }
        : invalid(`${definition.label} must be one of the supported choices.`);
  }
}

export function assertValidParameterDefinition(definition: ParameterDefinition): void {
  if (!definition.key.trim()) {
    throw new Error("Parameter key must not be empty.");
  }

  if (!definition.label.trim()) {
    throw new Error(`Parameter ${definition.key} must have a label.`);
  }

  switch (definition.kind) {
    case "number":
      assertValidNumberDefinition(definition);
      break;
    case "choice":
      assertValidChoiceDefinition(definition);
      break;
    case "boolean":
      break;
  }
}

export function createDefaultParameters<
  TDefinitions extends readonly ParameterDefinition[],
>(
  definitions: TDefinitions,
): Record<TDefinitions[number]["key"], TDefinitions[number]["defaultValue"]> {
  const defaults: Record<string, unknown> = {};

  for (const definition of definitions) {
    assertValidParameterDefinition(definition);
    defaults[definition.key] = definition.defaultValue;
  }

  return defaults as Record<
    TDefinitions[number]["key"],
    TDefinitions[number]["defaultValue"]
  >;
}

function validateNumberParameter(
  definition: NumberParameterDefinition,
  value: unknown,
): ParameterValidationResult {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return invalid(`${definition.label} must be a finite number.`);
  }

  if (value < definition.min || value > definition.max) {
    return invalid(
      `${definition.label} must be between ${String(definition.min)} and ${String(definition.max)}${formatUnit(definition.unit)}.`,
    );
  }

  return { valid: true };
}

function assertValidNumberDefinition(definition: NumberParameterDefinition): void {
  if (!Number.isFinite(definition.min) || !Number.isFinite(definition.max)) {
    throw new Error(`${definition.label} bounds must be finite numbers.`);
  }

  if (definition.min >= definition.max) {
    throw new Error(`${definition.label} minimum must be less than maximum.`);
  }

  const defaultValidation = validateNumberParameter(
    definition,
    definition.defaultValue,
  );

  if (!defaultValidation.valid) {
    throw new Error(defaultValidation.message);
  }

  if (
    definition.step !== undefined &&
    (!Number.isFinite(definition.step) || definition.step <= 0)
  ) {
    throw new Error(`${definition.label} step must be a positive finite number.`);
  }
}

function assertValidChoiceDefinition(definition: ChoiceParameterDefinition): void {
  if (definition.options.length === 0) {
    throw new Error(`${definition.label} must define at least one option.`);
  }

  const values = new Set<string>();

  for (const option of definition.options) {
    if (values.has(option.value)) {
      throw new Error(`${definition.label} has duplicate option ${option.value}.`);
    }

    values.add(option.value);
  }

  const defaultIsSupported = definition.options.some(
    (option) => option.value === definition.defaultValue,
  );

  if (!defaultIsSupported) {
    throw new Error(`${definition.label} default value must be a supported option.`);
  }
}

function invalid(message: string): ParameterValidationResult {
  return { valid: false, message };
}

function formatUnit(unit: string | undefined): string {
  return unit ? ` ${unit}` : "";
}
