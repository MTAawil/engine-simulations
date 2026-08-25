# Rendering Standards

Use the renderer that fits the educational problem.

- PixiJS: premium 2D particles, waves, cells, laboratory scenes, vectors, animated diagrams.
- Three.js: 3D scientific scenes, camera-based demonstrations, selected molecules/structures, lighting, particles, shaders.
- Motion: UI animation when CSS is insufficient.
- KaTeX: mathematical equations.
- D3 or Plotly: graphing when a simulation requires it; do not install both automatically.

Renderers must clean up animation loops, listeners, geometries, materials, textures, renderer resources, workers, and subscriptions.

Visual effects must communicate educational meaning. If a visual is illustrative rather than exact, document the approximation.
