import type { Camera, Scene, WebGLRenderer } from "three";
import type { SimulationSnapshot } from "../../core/simulation";
import type { RendererSize, SimulationRenderer } from "../lifecycle";

export type ThreeRendererLike = Pick<
  WebGLRenderer,
  "dispose" | "render" | "setSize"
> & {
  readonly domElement: HTMLCanvasElement;
};

export type ThreeSceneContext = {
  camera: Camera;
  container: HTMLElement;
  renderer: ThreeRendererLike;
  scene: Scene;
};

export type ThreeSceneResources<TState> = {
  camera: Camera;
  renderer: ThreeRendererLike;
  scene: Scene;
  update?: (snapshot: SimulationSnapshot<TState>, context: ThreeSceneContext) => void;
  resize?: (size: RendererSize, context: ThreeSceneContext) => void;
  dispose?: (context: ThreeSceneContext) => void;
};

export type ThreeSceneFactory<TState> = (
  container: HTMLElement,
) => ThreeSceneResources<TState>;

export function createThreeSceneRenderer<TState>(
  createScene: ThreeSceneFactory<TState>,
): SimulationRenderer<TState> {
  let context: ThreeSceneContext | null = null;
  let resources: ThreeSceneResources<TState> | null = null;

  return {
    mount(container) {
      if (context) {
        return;
      }

      resources = createScene(container);
      context = {
        camera: resources.camera,
        container,
        renderer: resources.renderer,
        scene: resources.scene,
      };

      if (resources.renderer.domElement.parentElement !== container) {
        container.append(resources.renderer.domElement);
      }
    },

    render(snapshot) {
      const mounted = assertMounted(context, resources, "render");

      mounted.resources.update?.(snapshot, mounted.context);
      mounted.context.renderer.render(mounted.context.scene, mounted.context.camera);
    },

    resize(size) {
      const mounted = assertMounted(context, resources, "resize");

      mounted.context.renderer.setSize(size.width, size.height, false);
      mounted.resources.resize?.(size, mounted.context);
    },

    destroy() {
      if (!context || !resources) {
        return;
      }

      const mountedContext = context;
      const mountedResources = resources;

      context = null;
      resources = null;

      try {
        mountedResources.dispose?.(mountedContext);
      } finally {
        mountedContext.renderer.dispose();
        mountedContext.renderer.domElement.remove();
      }
    },
  };
}

function assertMounted<TState>(
  context: ThreeSceneContext | null,
  resources: ThreeSceneResources<TState> | null,
  action: string,
) {
  if (!context || !resources) {
    throw new Error(`Cannot ${action} Three.js scene before it has mounted.`);
  }

  return { context, resources };
}
