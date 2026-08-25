import { describe, expect, it, vi } from "vitest";
import type { SimulationSnapshot } from "../../core/simulation";
import { RendererDisposalStack } from "./disposalStack";
import { RendererHost } from "./RendererHost";
import type { SimulationRenderer } from "./types";

type TestState = {
  value: number;
};

const snapshot: SimulationSnapshot<TestState> = {
  lifecycleState: "ready",
  state: { value: 7 },
  simulationTimeS: 1.25,
};

function createRenderer() {
  return {
    mount: vi.fn(),
    render: vi.fn(),
    resize: vi.fn(),
    destroy: vi.fn(),
  } satisfies SimulationRenderer<TestState>;
}

describe("RendererHost", () => {
  it("mounts, renders, resizes, and destroys a renderer in order", () => {
    const renderer = createRenderer();
    const host = new RendererHost(renderer);
    const container = document.createElement("div");

    host.mount(container);
    host.render(snapshot);
    host.resize({ width: 1280, height: 720 });
    host.destroy();

    expect(renderer.mount).toHaveBeenCalledWith(container);
    expect(renderer.render).toHaveBeenCalledWith(snapshot);
    expect(renderer.resize).toHaveBeenCalledWith({ width: 1280, height: 720 });
    expect(renderer.destroy).toHaveBeenCalledOnce();
    expect(host.state).toBe("destroyed");
  });

  it("rejects render calls before mount", () => {
    const host = new RendererHost(createRenderer());

    expect(() => {
      host.render(snapshot);
    }).toThrow('Cannot render renderer while lifecycle state is "idle".');
  });

  it("records mount errors and still allows destroy cleanup", () => {
    const renderer = createRenderer();
    const error = new Error("canvas unavailable");
    renderer.mount.mockImplementation(() => {
      throw error;
    });

    const host = new RendererHost(renderer);

    expect(() => {
      host.mount(document.createElement("div"));
    }).toThrow(error);
    expect(host.state).toBe("error");
    expect(host.lastError).toBe(error);

    host.destroy();

    expect(renderer.destroy).toHaveBeenCalledOnce();
    expect(host.state).toBe("destroyed");
  });

  it("destroys only once", () => {
    const renderer = createRenderer();
    const host = new RendererHost(renderer);

    host.destroy();
    host.destroy();

    expect(renderer.destroy).toHaveBeenCalledOnce();
  });
});

describe("RendererDisposalStack", () => {
  it("runs disposers in reverse registration order", () => {
    const order: string[] = [];
    const stack = new RendererDisposalStack();

    stack.add(() => order.push("first"));
    stack.add(() => order.push("second"));
    stack.dispose();

    expect(order).toEqual(["second", "first"]);
  });

  it("runs late disposers immediately after disposal", () => {
    const disposer = vi.fn();
    const stack = new RendererDisposalStack();

    stack.dispose();
    stack.add(disposer);

    expect(disposer).toHaveBeenCalledOnce();
  });
});
