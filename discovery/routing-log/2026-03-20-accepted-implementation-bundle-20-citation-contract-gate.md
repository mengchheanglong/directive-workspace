# Accepted Implementation Bundle 20 (Citation Contract Gate)

Date: 2026-03-20
Owner: Directive Architecture + Mission Control host checks
Status: executed

## Bundle Intent

Close gpt-researcher planned-next Slice 2 by hardening citation contract behavior (URL validity, dedupe, fallback synthesis) and enforcing it via a dedicated host gate.

## Directive Workspace Changes

- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\citation-set-fallback.md` (new)
- `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\05-reference-patterns\2026-03-20-citation-set-fallback-policy.md` (new)
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\schemas\citation-set-artifact.schema.json` (updated: URL constraints)
- `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\03-adopted\2026-03-19-gpt-researcher-directive-architecture-adopted-planned-next.md` (updated: implementation status)
- `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\02-experiments\2026-03-20-cross-source-contract-delta-slice-11.md` (new)

## Mission Control Changes

- `C:\Users\User\.openclaw\workspace\mission-control\src\lib\directive-workspace\lifecycle-artifacts.ts` (updated citation normalization/fallback logic)
- `C:\Users\User\.openclaw\workspace\mission-control\scripts\check-directive-citation-contracts.ts` (new)
- `C:\Users\User\.openclaw\workspace\mission-control\scripts\check-directive-architecture-schemas.ts` (updated schema guard check)
- `C:\Users\User\.openclaw\workspace\mission-control\scripts\check-ops-stack.ts` (wired `check:directive-citation-contracts`)
- `C:\Users\User\.openclaw\workspace\mission-control\package.json` (added `check:directive-citation-contracts`)

## Validation

- `npm run check:directive-citation-contracts` -> PASS
- `npm run typecheck` -> PASS
- `npm run check:directive-v0` -> PASS
- `npm run check:directive-integration-proof` -> PASS
- `npm run check:directive-workspace-health` -> PASS
- `npm run check:ops-stack` -> PASS
