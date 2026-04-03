# Runtime Promotion Specification Canonicalization

Date: 2026-04-01
Lane: `Runtime`
Track: `internal repo-native self-build`
Status: `completed`

## Bounded move

Turn Runtime promotion specifications into canonical, checked, host-consumable artifacts instead of loosely generated sidecars.

## Why this slice

- `road-to-completion.md` says the next completion seam after Runtime-owned callable proof is host adapter consumption.
- The repo already had non-executing promotion specifications, but they were still weaker than current Runtime truth:
  - `compileContractArtifact` was null
  - the generated JSON did not carry the linked callable stub
  - the shared Runtime state did not expose the promotion-specification path
  - no checker proved the generated JSON matched live promotion-readiness truth
- That made promotion specifications a weaker handoff surface than the anchor requires for the first host-loading seam.

## What changed

- Added `shared/lib/runtime-promotion-specification.ts` as the canonical shared builder/reader for Runtime promotion specifications.
- Updated `scripts/generate-promotion-specifications.ts` to generate promotion specifications from that shared builder.
- Strengthened `scripts/check-runtime-promotion-specification.ts` so it now:
  - verifies the generated JSON exists
  - verifies it matches current promotion-readiness truth
  - requires the compile contract artifact
  - requires the linked callable stub for the approved Scientify bundle
- Updated `shared/contracts/runtime-to-host.md` to be the truthful compile contract for the current host-loading seam instead of the stale Mission Control-era wording.
- Extended canonical Runtime state so promotion-readiness now links `runtimePromotionSpecificationPath`.
- Extended the standalone-host Scientify descriptor proof so the host sees the canonical promotion-specification path.
- Added the promotion-specification checker to `npm run check`.

## Proof path

- `npm run generate:promotion-specifications` regenerates all Runtime promotion specifications from the shared builder.
- `npm run check:runtime-promotion-specification` now proves the generated artifacts match current promotion-readiness truth.
- Focused canonical state on the Scientify promotion-readiness artifact now exposes:
  - `linkedArtifacts.runtimePromotionSpecificationPath`
  - `linkedArtifacts.runtimeCallableStubPath`
- `npm run check:directive-scientify-runtime-callable` proves the standalone-host descriptor and canonical Runtime truth expose the same promotion-specification path for the approved Scientify bundle.
- `npm run check` still passes after wiring the new proof surface into the full repo check chain.

## Rollback path

- Remove `shared/lib/runtime-promotion-specification.ts`.
- Revert the generator/checker to the previous promotion-readiness-only derivation.
- Remove `runtimePromotionSpecificationPath` from canonical Runtime truth and the standalone-host Scientify descriptor.
- Revert the compile-contract update in `shared/contracts/runtime-to-host.md`.
- Remove `check:runtime-promotion-specification` from the full repo check chain.

## Stop-line

Stop at canonical promotion-specification truth.
Do not open host-facing promotion, host integration, runtime execution, or callable activation in this slice.
