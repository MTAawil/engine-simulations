import {
  AmbientLight,
  ArrowHelper,
  BoxGeometry,
  Color,
  DirectionalLight,
  Group,
  Line,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
import type { BufferGeometry, Material } from "three";
import { createThreeSceneRenderer } from "../../rendering/three";
import type { ThreeSceneResources } from "../../rendering/three";
import type { ElectromagneticInductionState } from "./model";

export type ElectromagneticInductionSceneObjects = {
  coilGroup: Group;
  coilNormalArrow: ArrowHelper;
  currentArrow: ArrowHelper;
  currentIndicator: Mesh;
  fieldArrows: ArrowHelper[];
};

type DisposableRenderable =
  | Mesh<BufferGeometry, Material | Material[]>
  | Line<BufferGeometry, Material | Material[]>;

const positiveCurrentColor = new Color("#57c7b6");
const negativeCurrentColor = new Color("#f07c63");
const neutralCurrentColor = new Color("#d9e2e5");

export function createElectromagneticInductionRenderer() {
  return createThreeSceneRenderer<ElectromagneticInductionState>((container) =>
    createElectromagneticInductionScene(container),
  );
}

export function createElectromagneticInductionScene(
  container: HTMLElement,
): ThreeSceneResources<ElectromagneticInductionState> {
  const scene = new Scene();
  scene.background = new Color("#10161a");

  const camera = new PerspectiveCamera(42, getAspectRatio(container), 0.1, 100);
  camera.position.set(2.4, 1.8, 3.4);
  camera.lookAt(0, 0, 0);

  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth || 960, container.clientHeight || 540, false);

  const objects = createElectromagneticInductionSceneObjects();
  scene.add(objects.coilGroup);
  scene.add(...objects.fieldArrows);
  scene.add(new AmbientLight("#ffffff", 1.8));

  const keyLight = new DirectionalLight("#ffffff", 2.4);
  keyLight.position.set(3, 4, 4);
  scene.add(keyLight);

  return {
    camera,
    renderer,
    scene,
    update(snapshot) {
      updateElectromagneticInductionSceneObjects(objects, snapshot.state);
    },
    resize(size, context) {
      if (context.camera instanceof PerspectiveCamera) {
        context.camera.aspect = size.width / size.height;
        context.camera.updateProjectionMatrix();
      }
    },
    dispose() {
      disposeObjectTree(scene);
    },
  };
}

export function createElectromagneticInductionSceneObjects(): ElectromagneticInductionSceneObjects {
  const coilGroup = new Group();
  coilGroup.name = "rotating-coil";

  const wireMaterial = new MeshStandardMaterial({
    color: "#f2c14e",
    metalness: 0.28,
    roughness: 0.34,
  });

  const horizontalWireGeometry = new BoxGeometry(1.25, 0.035, 0.035);
  const verticalWireGeometry = new BoxGeometry(0.035, 0.9, 0.035);

  const topWire = new Mesh(horizontalWireGeometry, wireMaterial);
  topWire.position.y = 0.45;
  const bottomWire = new Mesh(horizontalWireGeometry, wireMaterial);
  bottomWire.position.y = -0.45;
  const leftWire = new Mesh(verticalWireGeometry, wireMaterial);
  leftWire.position.x = -0.625;
  const rightWire = new Mesh(verticalWireGeometry, wireMaterial);
  rightWire.position.x = 0.625;

  const normalArrow = new ArrowHelper(
    new Vector3(0, 0, 1),
    new Vector3(0, 0, 0),
    0.72,
    "#8dd8cf",
    0.14,
    0.07,
  );
  normalArrow.name = "coil-normal";

  const currentArrow = new ArrowHelper(
    new Vector3(1, 0, 0),
    new Vector3(-0.25, 0.5, 0),
    0.5,
    positiveCurrentColor,
    0.12,
    0.06,
  );
  currentArrow.name = "current-direction";

  const currentIndicator = new Mesh(
    new BoxGeometry(0.16, 0.16, 0.16),
    new MeshStandardMaterial({ color: neutralCurrentColor }),
  );
  currentIndicator.name = "current-indicator";
  currentIndicator.position.set(0.82, 0, 0);

  coilGroup.add(
    topWire,
    bottomWire,
    leftWire,
    rightWire,
    normalArrow,
    currentArrow,
    currentIndicator,
  );

  return {
    coilGroup,
    coilNormalArrow: normalArrow,
    currentArrow,
    currentIndicator,
    fieldArrows: createFieldArrows(),
  };
}

export function updateElectromagneticInductionSceneObjects(
  objects: ElectromagneticInductionSceneObjects,
  state: ElectromagneticInductionState,
) {
  objects.coilGroup.rotation.y = state.angleRad;

  const currentDirection =
    state.inducedCurrentDirection === "negative"
      ? new Vector3(-1, 0, 0)
      : new Vector3(1, 0, 0);

  objects.currentArrow.setDirection(currentDirection);
  objects.currentArrow.visible = state.inducedCurrentDirection !== "none";
  setCurrentIndicatorColor(objects.currentIndicator, state.inducedCurrentDirection);
}

function createFieldArrows() {
  const arrows: ArrowHelper[] = [];
  const positions = [-0.9, 0, 0.9];

  for (const x of positions) {
    for (const y of [-0.55, 0.55]) {
      const arrow = new ArrowHelper(
        new Vector3(0, 0, 1),
        new Vector3(x, y, -0.8),
        1.6,
        "#4f8cff",
        0.18,
        0.08,
      );
      arrow.name = "uniform-field-arrow";
      arrows.push(arrow);
    }
  }

  return arrows;
}

function setCurrentIndicatorColor(
  indicator: Mesh,
  direction: ElectromagneticInductionState["inducedCurrentDirection"],
) {
  const material = indicator.material;
  const color =
    direction === "positive"
      ? positiveCurrentColor
      : direction === "negative"
        ? negativeCurrentColor
        : neutralCurrentColor;

  if (material instanceof MeshStandardMaterial) {
    material.color.copy(color);
  }
}

function getAspectRatio(container: HTMLElement) {
  const width = container.clientWidth || 960;
  const height = container.clientHeight || 540;

  return width / height;
}

function disposeObjectTree(scene: Scene) {
  scene.traverse((object) => {
    if (object instanceof Mesh || object instanceof Line) {
      const renderable = object as DisposableRenderable;
      renderable.geometry.dispose();
      disposeMaterial(renderable.material);
    }
  });
}

function disposeMaterial(material: Material | Material[]) {
  if (Array.isArray(material)) {
    for (const item of material) {
      item.dispose();
    }
    return;
  }

  material.dispose();
}
