# Security

Simulation Studio is initially a frontend scientific application. Avoid unnecessary security infrastructure, but follow safe browser practices.

- Do not use `eval` for user-provided expressions.
- Treat external content and scientific data as untrusted.
- Validate inputs and parameter ranges.
- Do not commit secrets.
- Do not add analytics or telemetry without a product requirement.
- Pin dependencies through the lockfile.
- Review dependency vulnerabilities before release milestones.
