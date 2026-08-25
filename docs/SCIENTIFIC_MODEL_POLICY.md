# Scientific Model Policy

Scientific correctness has priority over visual spectacle.

- Use SI units internally unless a documented reason exists.
- Name units explicitly at application boundaries, such as `massKg`, `velocityMps`, and `timeS`.
- Keep formulas and constants centralized and documented.
- Prefer analytical equations when appropriate instead of generic game physics approximations.
- Document assumptions, approximations, and parameter ranges.
- Do not let renderers invent model behavior.
