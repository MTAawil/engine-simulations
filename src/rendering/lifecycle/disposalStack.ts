export type RendererDisposer = () => void;

export class RendererDisposalStack {
  readonly #disposers: RendererDisposer[] = [];
  #hasDisposed = false;

  add(disposer: RendererDisposer) {
    if (this.#hasDisposed) {
      disposer();
      return;
    }

    this.#disposers.push(disposer);
  }

  dispose() {
    if (this.#hasDisposed) {
      return;
    }

    this.#hasDisposed = true;

    const errors: unknown[] = [];
    while (this.#disposers.length > 0) {
      const disposer = this.#disposers.pop();

      try {
        disposer?.();
      } catch (error) {
        errors.push(error);
      }
    }

    if (errors.length > 0) {
      throw new AggregateError(errors, "Renderer disposal failed");
    }
  }
}
