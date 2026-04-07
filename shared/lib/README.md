# Shared Libraries

`shared/lib/` is now the residual support layer beside the Engine-owned lane homes.

It should stay smaller than `engine/` and contain only code that is still:
- product-owned
- host-agnostic
- cross-cutting
- not the canonical home of a lane lifecycle or state surface

## What belongs here

1. Engine support services
- operator/report helpers
- artifact/storage compatibility helpers

2. Small reusable support utilities that do not define lane ownership

## What does not belong here

- Architecture lane operating code
- Runtime lane operating code
- Discovery lane operating code
- canonical state resolution
- host-only API or persistence code
- raw source corpora
- lane artifact records and proof markdown
- local scratch or one-off migration debris

## Navigation

Start with these Engine-owned grouped surfaces first:

- `architecture/lib/`
- `runtime/lib/`
- `discovery/lib/`
- `engine/state/`
- `engine/cases/`
- `engine/coordination/`
- `engine/execution/`
- `hosts/adapters/`

Open `shared/lib/` only when you need residual support code rather than a lane home.

Recent lane-owned moves out of this folder:
- `architecture/lib/lifecycle-review-feedback.ts`
- `architecture/lib/operational-architecture-improvement-candidates.ts`
- `architecture/lib/operator-simplicity-loop-control.ts`

Current residual files that still belong here:
- `directive-workspace-artifact-storage.ts`
  Canonical logical-to-physical artifact path/storage compatibility for multiple lanes and host read surfaces.
- `structured-output-fallback.ts`
  Small host-agnostic structured-output parsing fallback used by other shared artifact helpers.
- `lifecycle-artifacts.ts`
  Cross-track lifecycle artifact normalizers built on the structured-output fallback surface.
- `integration-artifact-generator.ts`
  Generic integration/proof artifact generation helper rather than a lane lifecycle owner.
- `literature-monitoring-artifacts.ts`
  Shared literature-monitoring artifact normalizers and builders, mirrored into host inventory as a reusable support surface.

Stop-line:
- if a file here gains a clearer lane, Engine, or host ownership surface, move it there
- otherwise leave it here instead of manufacturing a prettier but less truthful tree
