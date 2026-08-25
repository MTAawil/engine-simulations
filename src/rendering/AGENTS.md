# Rendering Rules

- Renderers consume simulation state; they must not invent scientific behavior.
- Use PixiJS for premium 2D and Three.js for premium 3D only when the simulation needs them.
- Clean up animation loops, event listeners, geometries, materials, textures, renderer resources, workers, and subscriptions.
- Keep high-frequency visual updates out of React state.

Authoritative references:

- `docs/RENDERING_STANDARDS.md`
- `docs/PERFORMANCE.md`
- `docs/ACCESSIBILITY.md`
