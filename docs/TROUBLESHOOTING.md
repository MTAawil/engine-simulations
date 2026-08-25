# Troubleshooting

## Install Fails

Use the committed package manager:

```bash
pnpm install
```

If dependency resolution changes unexpectedly, inspect `pnpm-lock.yaml` before committing.

## Blank Screen

Check the browser console, `src/app/main.tsx`, and renderer initialization. User-facing failures should show understandable error states once the simulation host exists.

## QA Fails

Run the failing command directly before using filtered output. RTK may reduce routine noise, but raw output is required for difficult debugging, suspicious failures, scientific validation, security review, and license audit.
