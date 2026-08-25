import type { GraphDomain, GraphPoint } from "./TimeSeriesGraph";

const padding = {
  bottom: 40,
  left: 48,
  right: 16,
  top: 20,
} as const;

export function getGraphPadding() {
  return padding;
}

export function createTimeSeriesPath(
  points: readonly GraphPoint[],
  xDomain: GraphDomain,
  yDomain: GraphDomain,
  width: number,
  height: number,
) {
  if (points.length === 0) {
    return "";
  }

  return points
    .map((point, index) => {
      const x = scaleToRange(point.x, xDomain, padding.left, width - padding.right);
      const y = scaleToRange(point.y, yDomain, height - padding.bottom, padding.top);

      return `${index === 0 ? "M" : "L"} ${String(roundForSvg(x))} ${String(
        roundForSvg(y),
      )}`;
    })
    .join(" ");
}

export function deriveGraphDomain(values: readonly number[]): GraphDomain {
  if (values.length === 0) {
    return { min: 0, max: 1 };
  }

  const min = Math.min(...values);
  const max = Math.max(...values);

  if (min === max) {
    const paddingValue = Math.max(Math.abs(min) * 0.1, 1);
    return { min: min - paddingValue, max: max + paddingValue };
  }

  return { min, max };
}

function scaleToRange(
  value: number,
  domain: GraphDomain,
  rangeMin: number,
  rangeMax: number,
) {
  const domainSize = domain.max - domain.min;
  const normalized = domainSize === 0 ? 0.5 : (value - domain.min) / domainSize;

  return rangeMin + normalized * (rangeMax - rangeMin);
}

function roundForSvg(value: number) {
  return Number(value.toFixed(3));
}
