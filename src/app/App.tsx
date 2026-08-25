import { ElectromagneticInductionSceneView } from "../simulations/electromagnetic-induction";

const prototypeChecks = [
  "Reviewed rotating-coil specification",
  "Pure deterministic induction model",
  "Three.js scene consumes model snapshots",
  "Next: controls, telemetry, and graph wiring",
] as const;

export function App() {
  return (
    <main className="app-shell">
      <section className="intro" aria-labelledby="page-title">
        <p className="eyebrow">Simulation Studio</p>
        <h1 id="page-title">Electromagnetic induction prototype</h1>
        <p className="lede">
          A deterministic rotating-coil model is now feeding the first 3D scene
          boundary. The prototype is being built from science outward.
        </p>
      </section>

      <section className="status-panel" aria-labelledby="status-title">
        <ElectromagneticInductionSceneView />
        <div>
          <p className="eyebrow">Current phase</p>
          <h2 id="status-title">Prototype visual scene</h2>
        </div>
        <ul>
          {prototypeChecks.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
