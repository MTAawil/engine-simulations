import type { SimulationSnapshot } from "../../core/simulation";
import type { RendererLifecycleState, RendererSize, SimulationRenderer } from "./types";

export class RendererHost<TState> {
  #state: RendererLifecycleState = "idle";
  #lastError: unknown = null;
  readonly #renderer: SimulationRenderer<TState>;

  constructor(renderer: SimulationRenderer<TState>) {
    this.#renderer = renderer;
  }

  get state() {
    return this.#state;
  }

  get lastError() {
    return this.#lastError;
  }

  mount(container: HTMLElement) {
    this.#assertNotDestroyed("mount");

    if (this.#state === "mounted") {
      return;
    }

    this.#state = "mounting";
    this.#lastError = null;

    try {
      this.#renderer.mount(container);
      this.#state = "mounted";
    } catch (error) {
      this.#state = "error";
      this.#lastError = error;
      throw error;
    }
  }

  render(snapshot: SimulationSnapshot<TState>) {
    this.#assertMounted("render");
    this.#renderer.render(snapshot);
  }

  resize(size: RendererSize) {
    this.#assertMounted("resize");
    this.#renderer.resize?.(size);
  }

  destroy() {
    if (this.#state === "destroyed") {
      return;
    }

    try {
      this.#renderer.destroy();
    } finally {
      this.#state = "destroyed";
    }
  }

  #assertMounted(action: string) {
    this.#assertNotDestroyed(action);

    if (this.#state !== "mounted") {
      throw new Error(
        `Cannot ${action} renderer while lifecycle state is "${this.#state}".`,
      );
    }
  }

  #assertNotDestroyed(action: string) {
    if (this.#state === "destroyed") {
      throw new Error(`Cannot ${action} renderer after it has been destroyed.`);
    }
  }
}
