# RTK Development Tool

RTK (`rtk-ai/rtk`) is an optional Codex development tool for reducing noisy command output. It is not a production dependency and must not be imported into application source.

Local status on 2026-08-25: `rtk --version` was not found.

Official installation guidance checked on 2026-08-25:

- Verify existing install with `rtk --version` and `rtk gain`.
- Windows users can install from the official GitHub release prebuilt binary.
- Cargo installation should use the explicit `rtk-ai/rtk` Git URL to avoid the unrelated crate name collision.

Use RTK only when it meaningfully reduces routine output. Rerun raw commands for difficult debugging, scientific verification, security review, dependency/license audit, suspicious test failures, or incomplete filtered output.
