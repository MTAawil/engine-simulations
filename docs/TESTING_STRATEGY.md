# Testing Strategy

## Fast QA

Used during normal development:

- lint
- typecheck
- relevant unit tests
- relevant scientific tests

Command:

```bash
pnpm qa:fast
```

## Full QA

Used for milestone completion:

- fast QA
- production build
- integration tests
- Playwright smoke checks
- meaningful visual regression
- accessibility smoke checks
- dependency/license checks where applicable

Command:

```bash
pnpm qa:full
```

Playwright and visual regression are planned when the first interactive experience exists.
