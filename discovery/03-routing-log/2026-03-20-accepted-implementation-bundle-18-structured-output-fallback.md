# Accepted Implementation Bundle 18 (Structured Output Fallback Policy)

Date: 2026-03-20
Owner: Directive Architecture + Mission Control host checks
Status: executed

## Bundle Intent

Materialize Paper2Code Slice 2 by enforcing deterministic typed fallback parsing for noisy structured outputs in directive lifecycle artifacts.

## Directive Workspace Changes

- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\structured-output-fallback.md` (new)
- `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\05-reference-patterns\2026-03-20-structured-output-fallback-parser-policy.md` (new)
- `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\README.md` (canonical reference list updated)

## Mission Control Changes

- `C:\Users\User\.openclaw\workspace\mission-control\src\lib\directive-workspace\structured-output-fallback.ts` (new)
- `C:\Users\User\.openclaw\workspace\mission-control\src\lib\directive-workspace\lifecycle-artifacts.ts` (fallback parser bindings)
- `C:\Users\User\.openclaw\workspace\mission-control\scripts\check-directive-structured-output-fallback.ts` (new)
- `C:\Users\User\.openclaw\workspace\mission-control\package.json` (new script: `check:directive-structured-output-fallback`)
- `C:\Users\User\.openclaw\workspace\mission-control\scripts\check-ops-stack.ts` (ops-stack includes parser fallback check)

## Validation

- `npm run check:directive-structured-output-fallback` -> PASS
- `npm run typecheck` -> PASS
- `npm run check:directive-v0` -> PASS
- `npm run check:directive-integration-proof` -> PASS
- `npm run check:directive-workspace-health` -> PASS
- `npm run check:directive-promotion-quality-contracts` -> PASS
- `npm run check:ops-stack` -> PASS
