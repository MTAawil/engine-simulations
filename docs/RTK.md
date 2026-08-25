# RTK Development Tool

RTK (`rtk-ai/rtk`) is an optional Codex development tool for reducing noisy command output. It is not a production dependency and must not be imported into application source.

## Local Installation

Installed on 2026-08-25:

- Version: `rtk 0.42.0`
- Install path: `C:\Users\admin\.local\bin\rtk.exe`
- Source: official GitHub release `rtk-ai/rtk` asset `rtk-x86_64-pc-windows-msvc.zip`
- User PATH updated to include `C:\Users\admin\.local\bin`

Verification performed:

```powershell
rtk --version
rtk gain
```

`rtk gain` reported no tracking data yet, which is expected before RTK-wrapped commands have been used.

## Usage Policy

Use RTK only when it meaningfully reduces routine output, such as noisy builds, tests, linting, Git output, package-manager output, and file searches.

Rerun raw commands for difficult debugging, scientific verification, security review, dependency/license audit, suspicious test failures, or incomplete filtered output.

RTK must never hide information required to understand a failure.
