import type { SimulationSnapshot } from "../../core/simulation";

export type RendererSize = {
  width: number;
  height: number;
};

export type SimulationRenderer<TState> = {
  mount: (container: HTMLElement) => void;
  render: (snapshot: SimulationSnapshot<TState>) => void;
  resize?: (size: RendererSize) => void;
  destroy: () => void;
};

export type RendererLifecycleState =
  "idle" | "mounting" | "mounted" | "error" | "destroyed";
