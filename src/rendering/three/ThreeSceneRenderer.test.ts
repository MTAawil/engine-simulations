import { describe, expect, it, vi } from "vitest";
import type { Camera, Scene } from "three";
import type { SimulationSnapshot } from "../../core/simulation";
import { createThreeSceneRenderer, type ThreeRendererLike } from "./ThreeSceneRenderer";

type TestState = {
  angleRad: number;
};

const snapshot: SimulationSnapshot<TestState> = {
  lifecycleState: "ready",
  simulationTimeS: 0.5,
  state: { angleRad: Math.PI / 2 },
};

function createFakeThreeObjects() {
  const canvas = document.createElement("canvas");
  const renderer = {
    dispose: vi.fn(),
    domElement: canvas,
    render: vi.fn(),
    setSize: vi.fn(),
  } satisfies ThreeRendererLike;

  return {
    camera: {} as Camera,
    renderer,
    scene: {} as Scene,
  };
}

describe("createThreeSceneRenderer", () => {
  it("creates resources during mount and appends the renderer canvas", () => {
    const container = document.createElement("div");
    const threeObjects = createFakeThreeObjects();
    const renderer = createThreeSceneRenderer(() => threeObjects);

    renderer.mount(container);

    expect(container.firstElementChild).toBe(threeObjects.renderer.domElement);
  });

  it("updates simulation-driven visuals before rendering the scene", () => {
    const threeObjects = createFakeThreeObjects();
    const update = vi.fn();
    const renderer = createThreeSceneRenderer(() => ({
      ...threeObjects,
      update,
    }));

    renderer.mount(document.createElement("div"));
    renderer.render(snapshot);

    expect(update).toHaveBeenCalledWith(
      snapshot,
      expect.objectContaining({
        camera: threeObjects.camera,
        renderer: threeObjects.renderer,
        scene: threeObjects.scene,
      }),
    );
    expect(threeObjects.renderer.render).toHaveBeenCalledWith(
      threeObjects.scene,
      threeObjects.camera,
    );
  });

  it("resizes the renderer and forwards custom resize behavior", () => {
    const threeObjects = createFakeThreeObjects();
    const resize = vi.fn();
    const renderer = createThreeSceneRenderer(() => ({
      ...threeObjects,
      resize,
    }));

    renderer.mount(document.createElement("div"));
    renderer.resize?.({ width: 960, height: 540 });

    expect(threeObjects.renderer.setSize).toHaveBeenCalledWith(960, 540, false);
    expect(resize).toHaveBeenCalledWith(
      { width: 960, height: 540 },
      expect.objectContaining({ renderer: threeObjects.renderer }),
    );
  });

  it("disposes custom resources, renderer resources, and canvas attachment", () => {
    const container = document.createElement("div");
    const threeObjects = createFakeThreeObjects();
    const dispose = vi.fn();
    const renderer = createThreeSceneRenderer(() => ({
      ...threeObjects,
      dispose,
    }));

    renderer.mount(container);
    renderer.destroy();

    expect(dispose).toHaveBeenCalledOnce();
    expect(threeObjects.renderer.dispose).toHaveBeenCalledOnce();
    expect(container.contains(threeObjects.renderer.domElement)).toBe(false);
  });

  it("rejects render calls before mount", () => {
    const renderer = createThreeSceneRenderer(() => createFakeThreeObjects());

    expect(() => {
      renderer.render(snapshot);
    }).toThrow("Cannot render Three.js scene before it has mounted.");
  });
});
