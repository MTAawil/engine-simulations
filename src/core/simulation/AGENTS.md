# Simulation Core Rules

- Keep simulation contracts small and capability-based.
- Do not add subject-specific abstractions until a real simulation requires them.
- Keep timing deterministic and separate from rendering frame rate.
- Prefer pure TypeScript interfaces and composition over inheritance-heavy designs.

Authoritative references:

- `docs/SIMULATION_CONTRACT.md`
- `docs/ARCHITECTURE.md`
- `docs/TESTING_STRATEGY.md`
