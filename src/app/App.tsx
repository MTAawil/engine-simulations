import { useState } from "react";
import { ElectromagneticInductionPrototype } from "../simulations/electromagnetic-induction";
import { MeiosisPrototype } from "../simulations/meiosis";

type ActiveSimulation = "electromagnetic-induction" | "meiosis";

export function App() {
  const [activeSimulation, setActiveSimulation] = useState<ActiveSimulation>(
    "electromagnetic-induction",
  );

  return (
    <>
      <nav className="simulation-switcher" aria-label="Simulation selection">
        <button
          aria-pressed={activeSimulation === "electromagnetic-induction"}
          onClick={() => {
            setActiveSimulation("electromagnetic-induction");
          }}
          type="button"
        >
          Electromagnetic induction
        </button>
        <button
          aria-pressed={activeSimulation === "meiosis"}
          onClick={() => {
            setActiveSimulation("meiosis");
          }}
          type="button"
        >
          Meiosis
        </button>
      </nav>
      {activeSimulation === "electromagnetic-induction" ? (
        <ElectromagneticInductionPrototype />
      ) : (
        <MeiosisPrototype />
      )}
    </>
  );
}
