# Architecture Deep Materialization

This folder is the canonical physical storage root for the DEEP-only Architecture materialization chain.

Contained stages:
- `04-implementation-targets`
- `05-implementation-results`
- `06-retained`
- `07-integration-records`
- `08-consumption-records`
- `09-post-consumption-evaluations`

Important:
- logical artifact paths remain stable at `architecture/04-...` through `architecture/09-...`
- shared resolvers map those logical paths to this physical storage root
- do not recreate the old top-level `architecture/04-...` through `architecture/09-...` folders
- operator-facing guidance still treats this entire bundle as DEEP-only

Canonical compatibility surfaces:
- `C:\Users\User\projects\directive-workspace\shared\lib\architecture-deep-tail-stage-map.ts`
- `C:\Users\User\projects\directive-workspace\shared\lib\directive-workspace-artifact-storage.ts`
