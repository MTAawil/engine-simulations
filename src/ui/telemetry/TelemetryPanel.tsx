import { formatTelemetryValue } from "./formatTelemetryValue";

export type TelemetryValue = string | number | boolean;

export type TelemetryDatum = {
  id: string;
  label: string;
  value: TelemetryValue;
  unit?: string;
  precision?: number;
  description?: string;
  format?: (value: TelemetryValue) => string;
};

export type TelemetryPanelProps = {
  title?: string;
  data: readonly TelemetryDatum[];
  emptyMessage?: string;
};

export function TelemetryPanel({
  title = "Telemetry",
  data,
  emptyMessage = "No telemetry available",
}: TelemetryPanelProps) {
  return (
    <section className="telemetry-panel" aria-labelledby="telemetry-panel-title">
      <h2 id="telemetry-panel-title">{title}</h2>
      {data.length === 0 ? (
        <p>{emptyMessage}</p>
      ) : (
        <dl>
          {data.map((datum) => (
            <div className="telemetry-row" key={datum.id}>
              <dt>{datum.label}</dt>
              <dd>
                <output
                  aria-describedby={
                    datum.description ? `${datum.id}-description` : undefined
                  }
                >
                  {formatTelemetryValue(datum)}
                </output>
                {datum.description ? (
                  <span id={`${datum.id}-description`}>{datum.description}</span>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
