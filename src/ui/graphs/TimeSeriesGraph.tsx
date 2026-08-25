import { useId } from "react";
import { createTimeSeriesPath, deriveGraphDomain, getGraphPadding } from "./graphMath";

export type GraphPoint = {
  x: number;
  y: number;
};

export type GraphSeries = {
  id: string;
  label: string;
  color: string;
  points: readonly GraphPoint[];
};

export type GraphDomain = {
  min: number;
  max: number;
};

export type TimeSeriesGraphProps = {
  title: string;
  xLabel: string;
  yLabel: string;
  series: readonly GraphSeries[];
  xDomain?: GraphDomain;
  yDomain?: GraphDomain;
  width?: number;
  height?: number;
  emptyMessage?: string;
};

export function TimeSeriesGraph({
  title,
  xLabel,
  yLabel,
  series,
  xDomain = deriveGraphDomain(
    series.flatMap((item) => item.points.map((point) => point.x)),
  ),
  yDomain = deriveGraphDomain(
    series.flatMap((item) => item.points.map((point) => point.y)),
  ),
  width = 640,
  height = 360,
  emptyMessage = "No graph data available",
}: TimeSeriesGraphProps) {
  const titleId = useId();
  const axisLabelsId = useId();
  const hasData = series.some((item) => item.points.length > 0);
  const padding = getGraphPadding();

  return (
    <figure className="time-series-graph" aria-labelledby={titleId}>
      <svg
        role="img"
        viewBox={`0 0 ${String(width)} ${String(height)}`}
        aria-describedby={axisLabelsId}
      >
        <title id={titleId}>{title}</title>
        <g stroke="currentColor" strokeWidth="1">
          <line
            x1={padding.left}
            x2={width - padding.right}
            y1={height - padding.bottom}
            y2={height - padding.bottom}
          />
          <line
            x1={padding.left}
            x2={padding.left}
            y1={padding.top}
            y2={height - padding.bottom}
          />
        </g>

        {hasData ? (
          series.map((item) => (
            <path
              d={createTimeSeriesPath(item.points, xDomain, yDomain, width, height)}
              fill="none"
              key={item.id}
              stroke={item.color}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
            />
          ))
        ) : (
          <text x={width / 2} y={height / 2} textAnchor="middle">
            {emptyMessage}
          </text>
        )}

        <g id={axisLabelsId}>
          <text x={width / 2} y={height - 8} textAnchor="middle">
            {xLabel}
          </text>
          <text
            textAnchor="middle"
            transform={`translate(16 ${String(height / 2)}) rotate(-90)`}
          >
            {yLabel}
          </text>
        </g>
      </svg>

      {hasData ? (
        <figcaption>
          {series.map((item) => (
            <span key={item.id}>
              <span aria-hidden="true" style={{ backgroundColor: item.color }} />
              {item.label}
            </span>
          ))}
        </figcaption>
      ) : null}
    </figure>
  );
}
