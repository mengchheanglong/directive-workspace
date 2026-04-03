# Canonical Read Surface Coverage Check

Date: 2026-03-31
Affected layer: Engine (shared whole-product truth surface)
Owning lane: Architecture (Engine self-improvement)
Phase: Internal Repo-Native Self-Build Phase
Seam: shared Engine truth/control hardening with canonical-read-surface enforcement
Mode: STANDARD
Slice: first bounded internal slice

## What was done

Added `check:canonical-read-surface-coverage` as a machine-enforced proof that the canonical read surface (`shared/lib/dw-state.ts` via `resolveDirectiveWorkspaceState`) resolves all routed queue entries correctly.

The check:
- reads every entry in `discovery/intake-queue.json`
- resolves each entry with a `routing_record_path` through the canonical surface
- verifies: non-null focus, `integrityState: "ok"`, `routeTarget` matches queue `routing_target`, `candidateId` matches
- exempts entries without `routing_record_path` (legacy/pre-routing entries)
- outputs structured JSON with the checker contract pattern (`ok`, `checkerId`, `failureContractVersion`, `violations`)
- added to the main `npm run check` pipeline

## Why this slice was chosen

Investigation of current repo truth found:
- the canonical read surface works correctly for all 39 routed queue entries (verified ad hoc)
- but there was no permanent machine-enforced proof of this
- no import-level enforcement mechanism was justified (dependency-cruiser and ESLint approaches were already evaluated and rejected in prior cases)
- the strongest "canonical-read-surface enforcement" gap was the lack of output-level enforcement: proving the surface actually resolves all current cases

## Repo truth verified

- `npm run check` passes (all existing checks green)
- `npm run report:directive-workspace-state` runs clean with `ok: true`
- 61 total queue entries: 39 with routing_record_path (all resolve ok), 22 exempt (legacy/no routing record)
- No integrity violations, no route target mismatches, no null focuses, no resolution errors
- The internal repo-native self-build phase is active with this as the first implementation slice
- External subsystem phases remain parked

## Changes made

- `scripts/check-canonical-read-surface-coverage.ts` (new): the check script
- `package.json`: added `check:canonical-read-surface-coverage` script and added it to the `check` pipeline
- `control/logs/2026-03/2026-03-31-canonical-read-surface-coverage-check.md` (this file): control log

## Proof path

The check IS the proof. Running `npm run check:canonical-read-surface-coverage` produces structured JSON with `ok: true` confirming all 39 routed entries resolve correctly through the canonical surface.

## Rollback path

Remove `scripts/check-canonical-read-surface-coverage.ts` and revert the `package.json` changes.

## Stop-line

Stop after this slice. Do not broaden into:
- import-level enforcement (already evaluated and rejected)
- backfilling routing_record_paths for the 22 exempt entries
- anchor deduplication (presentation issue, not enforcement)
- additional checker rewrites
