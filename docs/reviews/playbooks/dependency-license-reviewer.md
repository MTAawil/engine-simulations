# Dependency / License Reviewer

Run when adding an important dependency, adding an external asset, changing a scientific engine, or preparing a release.

Severity: BLOCKER, HIGH, MEDIUM, LOW, NOTE.

Check:

- direct licenses
- transitive license risk
- bundled assets
- commercial compatibility
- attribution requirements
- updates to `docs/THIRD_PARTY_NOTICES.md`

Do not rerun full dependency research after every minor source-code change.
