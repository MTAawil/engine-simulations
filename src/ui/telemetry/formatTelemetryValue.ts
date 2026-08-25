import type { TelemetryDatum } from "./TelemetryPanel";

export function formatTelemetryValue({
  value,
  unit,
  precision,
  format,
}: Pick<TelemetryDatum, "format" | "precision" | "unit" | "value">) {
  const formatted = format
    ? format(value)
    : typeof value === "number"
      ? value.toFixed(precision ?? 2)
      : String(value);

  return unit ? `${formatted} ${unit}` : formatted;
}
