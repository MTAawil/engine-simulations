# QA Gates

Major simulation work is not done until:

- specification exists
- scientific assumptions are documented
- scientific tests pass
- TypeScript passes
- lint passes
- production build passes
- relevant interaction tests pass
- resources clean up correctly
- accessibility basics are checked
- reviewer playbooks run sequentially by the matching expert reviewer role
- blocking/high findings are resolved or explicitly accepted
- documentation and current status are updated
- owner testing guide exists

Do not declare success if visual quality, scientific certainty, performance, licensing, or tests are still materially weak.

## Reviewer Standard

Reviews happen at the end of a phase or meaningful milestone by default. Run an earlier focused review when risk is high, such as scientific formulas, licensing, renderer lifecycle, accessibility, or release readiness.

Each review must use the matching expert reviewer agent, required project-local skill, and playbook:

- Architecture Reviewer for system boundaries, module ownership, and long-term structure.
- Dependency / License Reviewer for third-party packages, assets, scientific data, fonts, and notices.
- Implementation Reviewer for correctness, maintainability, TypeScript quality, errors, lifecycle, and tests.
- Scientific Reviewer for assumptions, formulas, units, tolerances, invariants, and scientific honesty.
- Visual / UX Reviewer for interaction quality, presentation clarity, accessibility basics, and visual polish.
- Release QA Reviewer for final readiness, known issues, owner testing, and release risk.
