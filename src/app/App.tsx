const foundationChecks = [
  "Strict TypeScript application shell",
  "Repository-owned architecture and QA documentation",
  "Dependency policy before simulation-specific libraries",
  "Phase-gated path toward Electromagnetic Induction",
] as const;

export function App() {
  return (
    <main className="app-shell">
      <section className="intro" aria-labelledby="page-title">
        <p className="eyebrow">Simulation Studio</p>
        <h1 id="page-title">Premium educational simulation engine</h1>
        <p className="lede">
          Phase 0 is establishing the clean foundation: documentation, strict tooling,
          QA gates, and the first application surface.
        </p>
      </section>

      <section className="status-panel" aria-labelledby="status-title">
        <div>
          <p className="eyebrow">Current phase</p>
          <h2 id="status-title">Repository Foundation</h2>
        </div>
        <ul>
          {foundationChecks.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
