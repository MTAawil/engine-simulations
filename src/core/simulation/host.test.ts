import { describe, expect, it, vi } from "vitest";
import {
  SimulationHost,
  type Simulation,
  type SimulationContext,
  type SimulationSnapshot,
} from ".";

type TestState = {
  count: number;
};

type TestParameters = {
  speed: number;
};

type TestSimulationFixture = {
  simulation: Simulation<TestState, TestParameters>;
  spies: {
    initialize: ReturnType<typeof vi.fn>;
    play: ReturnType<typeof vi.fn>;
    pause: ReturnType<typeof vi.fn>;
    reset: ReturnType<typeof vi.fn>;
    step: ReturnType<typeof vi.fn>;
    destroy: ReturnType<typeof vi.fn>;
    setParameter: ReturnType<typeof vi.fn>;
  };
};

function createSimulation(
  overrides: Partial<Simulation<TestState, TestParameters>> = {},
): TestSimulationFixture {
  const state: TestState = { count: 0 };
  const spies = {
    initialize: vi.fn(),
    play: vi.fn(),
    pause: vi.fn(),
    reset: vi.fn(() => {
      state.count = 0;
    }),
    step: vi.fn((deltaTimeS: number) => {
      state.count += deltaTimeS;
    }),
    destroy: vi.fn(),
    setParameter: vi.fn(),
  };

  const simulation: Simulation<TestState, TestParameters> = {
    metadata: {
      id: "test-simulation",
      title: "Test Simulation",
      subject: "physics",
      summary: "A test simulation.",
      capabilities: ["playback", "deterministicStep", "parameters"],
    },
    initialize: spies.initialize,
    play: spies.play,
    pause: spies.pause,
    reset: spies.reset,
    step: spies.step,
    destroy: spies.destroy,
    setParameter: spies.setParameter,
    getSnapshot: vi.fn((): SimulationSnapshot<TestState> => ({
      lifecycleState: "ready",
      simulationTimeS: state.count,
      state,
    })),
    ...overrides,
  };

  return { simulation, spies };
}

describe("SimulationHost", () => {
  it("mounts a simulation and exposes ready status", async () => {
    const { simulation, spies } = createSimulation();
    const host = new SimulationHost(simulation);

    await host.mount();

    expect(spies.initialize).toHaveBeenCalledOnce();
    expect(host.getStatus()).toEqual({
      lifecycleState: "ready",
      error: null,
    });
  });

  it("delegates playback and deterministic step calls after mounting", async () => {
    const { simulation, spies } = createSimulation();
    const host = new SimulationHost(simulation);

    await host.mount();
    host.play();
    host.pause();
    host.step(0.25);
    host.setParameter("speed", 2);

    expect(spies.play).toHaveBeenCalledOnce();
    expect(spies.pause).toHaveBeenCalledOnce();
    expect(spies.step).toHaveBeenCalledWith(0.25);
    expect(spies.setParameter).toHaveBeenCalledWith("speed", 2);
    expect(host.getSnapshot().simulationTimeS).toBe(0.25);
  });

  it("rejects unsupported capability calls instead of requiring no-op methods", async () => {
    const state: TestState = { count: 0 };
    const simulation: Simulation<TestState, TestParameters> = {
      metadata: {
        id: "static-simulation",
        title: "Static Simulation",
        subject: "physics",
        summary: "A static surface.",
        capabilities: [],
      },
      initialize: vi.fn(),
      destroy: vi.fn(),
      getSnapshot: vi.fn((): SimulationSnapshot<TestState> => ({
        lifecycleState: "ready",
        simulationTimeS: 0,
        state,
      })),
    };
    const host = new SimulationHost(simulation);

    await host.mount();

    expect(() => {
      host.play();
    }).toThrow("Simulation does not support playback.");
    expect(() => {
      host.setParameter("speed", 2);
    }).toThrow("Simulation does not support parameters.");
  });

  it("records initialization errors and prevents later use", async () => {
    const initializationError = new Error("Renderer failed to initialize.");
    const { simulation } = createSimulation({
      initialize: vi.fn(() => {
        throw initializationError;
      }),
    });
    const host = new SimulationHost(simulation);

    await expect(host.mount()).rejects.toThrow(initializationError);
    expect(host.getStatus()).toEqual({
      lifecycleState: "error",
      error: initializationError,
    });
    expect(() => {
      host.play();
    }).toThrow(/error state/);
  });

  it("aborts initialization and destroys the simulation", async () => {
    let receivedSignal: AbortSignal | undefined;
    const initialize = vi.fn(({ signal }: SimulationContext) => {
      receivedSignal = signal;
    });
    const { simulation, spies } = createSimulation({
      initialize,
    });
    const host = new SimulationHost(simulation);

    await host.mount();
    host.destroy();
    host.destroy();

    if (!receivedSignal) {
      throw new Error("Expected simulation initialize to receive an abort signal.");
    }

    expect(receivedSignal.aborted).toBe(true);
    expect(spies.destroy).toHaveBeenCalledOnce();
    expect(host.getStatus().lifecycleState).toBe("destroyed");
  });

  it("rejects use before mounting", () => {
    const { simulation } = createSimulation();
    const host = new SimulationHost(simulation);

    expect(() => {
      host.play();
    }).toThrow(/not ready/);
  });
});
