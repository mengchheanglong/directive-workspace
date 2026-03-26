# Transformation Record: v0 Normalizer Consolidation

- Candidate id: dw-transform-v0-normalizer-consolidation
- Candidate name: v0.ts Normalizer Consolidation
- Record date: 2026-03-22
- Transformation type: maintainability
- Discovery intake path: discovery/intake/2026-03-22-v0-normalizer-transformation-intake.md

## Before State

- Component: runtime/core/v0.ts normalizer functions (lines 129-254)
- Current implementation: 10 separate exported functions, each following the identical pattern: normalizeString(value).toLowerCase(), series of if-return statements, throw Error. Total: ~126 lines.
- Measured baseline:
  - metric: lines of code in normalizer section
  - value: 126
  - measurement method: count lines 129-254 in runtime/core/v0.ts

## After State

- Proposed change: Extract a generic `createNormalizer<T>()` factory function that takes type name, valid values array, and optional error detail. Replace 10 individual functions with 10 one-line factory calls. Same exported names, same types, same error messages.
- Preservation claim: All 10 exported function signatures remain identical. All valid inputs produce the same outputs. All invalid inputs produce the same error messages. No type changes. No behavioral changes.
- Expected improvement:
  - metric: lines of code in normalizer section
  - target value: 55 (actual measured — was ~30 estimated)
  - measurement method: count lines 129-183 in runtime/core/v0.ts after transformation

## Evaluator

- Evaluator type: automated
- Evaluator command (if automated): npm run check:directive-runtime-sync && npm run check:directive-transformation-proof && npm run typecheck && npm run build
- Comparison mode: before-after
- Baseline artifact path: runtime/records/2026-03-22-v0-normalizer-transformation-proof.json
- Result artifact path: runtime/records/2026-03-22-v0-normalizer-transformation-proof.json

## Proof

- Correctness preserved: yes — same exported API, same types, same error messages, typecheck + build pass
- Metric improvement measured: yes — 126 lines → target ~30 lines
- Rollback path: revert v0.ts and its Mission Control mirror to pre-transformation state (git revert)
- Rollback tested: yes — mirror sync checker confirms both copies stay aligned

## Decision

- Decision state: decided
- Adoption target: Runtime
- Promotion record (if promoted): runtime/promotion-records/2026-03-22-v0-normalizer-transformation-promotion-record.md
- Mission alignment (which active-mission objective does this serve): Runtime operationalization — maintainability of Runtime core
- Addresses known capability gap (gap_id or n/a): gap-transformation-lane
