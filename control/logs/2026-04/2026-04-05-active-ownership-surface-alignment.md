# 2026-04-05 Active Ownership Surface Alignment

## Why

The repo's physical migration now places lane operating code under:

- `architecture/lib/`
- `runtime/lib/`
- `discovery/lib/`

with `engine/state/` remaining the canonical cross-lane state surface.

Several active authority and inventory files still described the older ownership model where lane definitions or lane code were presented as Engine-owned. That wording was stale enough to mislead future work even though the code migration itself was already in place.

## What changed

- Updated active doctrine and entry surfaces to describe:
  - `engine/` as the kernel plus cross-lane state/truth
  - `architecture/`, `runtime/`, and `discovery/` as lane-owned surfaces with `lib/` as the operating-code home
  - `shared/lib/` as residual cross-cutting support rather than a lane-code home
- Updated the standalone surface release-mode explanation to match the live folder ownership model.
- Updated the integration-kit guidance so hosts are warned against recreating lane lifecycle code locally rather than against an outdated "Engine lane definitions" concept.
- Updated active ownership and publish-readiness docs so they describe lane-owned operating surfaces instead of an older Engine-owned lane model.

## Proof path

- `npm run check:control-authority`
- `npm run check:directive-workspace-composition`
- `npm run check`

## Rollback

Revert the touched authority and inventory files plus this log entry.
