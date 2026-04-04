# Bounded Helper Dedup Frontier Closeout

Date: 2026-04-04

## Scope

Final bounded helper dedup pass after the larger optimization program.

## Changes

- Replaced duplicated helper copies in `shared/lib/architecture-bounded-closeout.ts` with shared imports from:
  - `shared/lib/architecture-deep-tail-artifact-helpers.ts`
  - `shared/lib/runtime-opener-shared.ts`
- Expanded `shared/lib/runtime-opener-shared.ts` to own shared markdown parsing helpers for:
  - markdown title extraction
  - required bullet extraction
  - bullet-list extraction
- Migrated the Runtime opener family and Discovery routing/lifecycle readers to that shared helper surface.

## Boundaries Preserved

- No artifact format changes
- No routing or approval semantics changes
- No opener workflow redesign
- No new generic framework introduced

## Remaining Local Variation

`shared/lib/runtime-follow-up-opener.ts` still keeps its local `optionalString()` variant because it folds `n/a` and `pending` into `null`. Lifting that behavior would require a new semantic option on the shared helper surface rather than a straight duplicate removal, so it is intentionally left local.

## Outcome

The bounded cleanup frontier is exhausted. Remaining repetition in the Runtime opener, runner, projection, and Architecture lifecycle families is framework-level redesign work rather than helper-grade cleanup.
