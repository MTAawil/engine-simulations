# Dependency Policy

Dependencies are added only when the current phase genuinely needs them.

Before adding a dependency:

1. Check the direct license.
2. Consider transitive license risk where relevant.
3. Inspect bundled assets separately when applicable.
4. Record the dependency in `docs/THIRD_PARTY_NOTICES.md`.
5. Prefer permissive licenses such as MIT, BSD, Apache-2.0, ISC, and zlib.

Avoid GPL, AGPL, non-commercial, CC BY-NC, and source-available licenses that restrict commercial use. LGPL/MPL require explicit evaluation and should be avoided when a permissive alternative exists.

Third-party source is immutable by default. Use public APIs, configuration, adapters, wrappers, composition, or supported extension points before considering a fork.
