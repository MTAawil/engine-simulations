import { useEffect, useMemo, useRef, useState } from "react";
import { RendererHost, type SimulationRenderer } from "../../rendering/lifecycle";
import {
  calculateElectromagneticInductionState,
  defaultElectromagneticInductionParameters,
  type ElectromagneticInductionState,
} from "./model";
import { createElectromagneticInductionRenderer } from "./scene";

export type ElectromagneticInductionSceneViewProps = {
  state?: ElectromagneticInductionState;
  createRenderer?: () => SimulationRenderer<ElectromagneticInductionState>;
};

export function ElectromagneticInductionSceneView({
  state = calculateElectromagneticInductionState(
    0.18,
    defaultElectromagneticInductionParameters,
  ),
  createRenderer = createElectromagneticInductionRenderer,
}: ElectromagneticInductionSceneViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<RendererHost<ElectromagneticInductionState> | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const snapshot = useMemo(
    () => ({
      lifecycleState: "ready" as const,
      simulationTimeS: state.timeS,
      state,
    }),
    [state],
  );
  const snapshotRef = useRef(snapshot);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || !canUseWebGL()) {
      setIsAvailable(false);
      return;
    }

    const host = new RendererHost(createRenderer());
    host.mount(container);
    host.resize({
      width: container.clientWidth || 960,
      height: container.clientHeight || 540,
    });
    host.render(snapshotRef.current);
    hostRef.current = host;

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(([entry]) => {
            if (!entry) {
              return;
            }

            host.resize({
              width: entry.contentRect.width,
              height: entry.contentRect.height,
            });
            host.render(snapshotRef.current);
          });

    resizeObserver?.observe(container);

    return () => {
      resizeObserver?.disconnect();
      host.destroy();
      hostRef.current = null;
    };
  }, [createRenderer]);

  useEffect(() => {
    snapshotRef.current = snapshot;
    hostRef.current?.render(snapshot);
  }, [snapshot]);

  return (
    <div className="induction-scene" aria-label="Electromagnetic induction 3D scene">
      <div ref={containerRef} className="induction-scene__canvas" />
      {isAvailable ? null : (
        <p className="induction-scene__fallback">
          3D scene preview requires WebGL in the browser.
        </p>
      )}
    </div>
  );
}

function canUseWebGL() {
  if (
    typeof WebGLRenderingContext === "undefined" &&
    typeof WebGL2RenderingContext === "undefined"
  ) {
    return false;
  }

  const canvas = document.createElement("canvas");

  return Boolean(
    canvas.getContext("webgl2") ??
    canvas.getContext("webgl") ??
    canvas.getContext("experimental-webgl"),
  );
}
