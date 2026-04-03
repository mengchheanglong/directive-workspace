# 2026-04-01 - Standalone Host Scientify Adapter Reader

## Slice

Materialize the first bounded standalone-host adapter reader for the Scientify Runtime capability by loading the canonical Runtime promotion specification through the existing host-owned `runtime-scientify-bundle` surface.

## Why this slice

- `road-to-completion.md` says the next completion seam after a Runtime-owned callable capability is first host adapter consumption.
- The prior slices already made the Scientify callable boundary explicit and proved the Runtime-owned literature-access bundle.
- The repo still lacked one truthful host-side reader that consumed the canonical promotion specification instead of exposing only a Runtime descriptor summary.

## Changes

- Extended `hosts/standalone-host/runtime-lane.ts` so the existing Scientify host surface now reads the canonical promotion specification and exposes one bounded adapter view:
  - adapter id
  - load mode
  - compile contract artifact
  - promotion specification path
  - callable stub path
  - integration mode
  - target Runtime surface
  - required gates
  - open decisions
  - host-consumable description
- Added `scripts/check-standalone-scientify-host-adapter.ts` as the dedicated proof surface for the host adapter reader.
- Expanded `scripts/check-host-adapter-boundary.ts` to allow the host to depend on `shared/lib/runtime-promotion-specification` explicitly.
- Updated `package.json` so the new host-adapter proof runs in the canonical repo check stack.
- Updated `hosts/standalone-host/README.md` so the current host surface is described truthfully.

## Proof

- `npm run check:standalone-scientify-host-adapter` proves the standalone host can load the Scientify promotion specification through its own surface and keep it aligned with canonical Runtime truth.
- `npm exec --yes tsx -- hosts/standalone-host/cli.ts runtime-scientify-bundle --directive-root C:\Users\User\projects\directive-workspace` now returns the adapter view, including the compile contract and promotion-spec path.
- `npm run check:host-adapter-boundary` still passes, so the host consumes the new seam only through an explicit adapter import.

## Rollback

- Remove the adapter block from the standalone-host Scientify descriptor.
- Remove the dedicated host-adapter checker and the new package script wiring.
- Remove the explicit host-boundary allowance for `shared/lib/runtime-promotion-specification`.
- Keep the Runtime-owned callable bundle proof and promotion specification intact.

## Stop-line

Stop once the host can truthfully read the approved Scientify promotion specification through a bounded adapter surface and the next move would require opening host-facing promotion, host integration, callable activation, runtime execution, or a broader decision/evidence seam.
