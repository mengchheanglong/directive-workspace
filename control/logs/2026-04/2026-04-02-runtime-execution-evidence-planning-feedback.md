# 2026-04-02 - Runtime Execution Evidence Planning Feedback

## Slice

- Era: `Era C - Make Feedback Real`
- Slice: `C2 - use evidence in later decisions`
- Owning lane: `Engine`
- Result: persisted callable execution evidence now changes one later Runtime planning decision in reviewable form

## What changed

- Extended `engine/directive-engine.ts` so Runtime planning reads the canonical callable-execution evidence surface when repo-root execution history exists.
- Kept the change soft-signal only:
  - no routing rewrite
  - no automatic workflow advancement
  - no host expansion
  - no promotion automation
- Extended `scripts/check-directive-engine-stage-chaining.ts` so the Runtime control proof now requires:
  - the callable-execution evidence summary in `improvementPlan.intendedDelta`
  - the execution-evidence review hint in `integrationProposal.nextAction`
  - an evidence-backed Runtime improvement goal when failure patterns exist

## Resulting decision change

- Runtime planning no longer relies only on promotion-history evidence.
- The canonical Runtime planning path now also sees:
  - bounded callable success history
  - bounded callable failure-pattern history
- That evidence changes one later reviewable decision:
  - Runtime improvement planning now prioritizes callable input-boundary clarity because execution evidence already contains a `validation_error` pattern.

## Proof path

- `npm run report:runtime-callable-execution-evidence`
- `npm run check:directive-engine-stage-chaining`
- `npm run check`

## Rollback

Revert:

- `engine/directive-engine.ts`
- `scripts/check-directive-engine-stage-chaining.ts`
- `shared/lib/runtime-callable-execution-evidence.ts`
- the persisted `runtime/callable-executions/` evidence files
- this log

## Stop-line

Stop once one later Runtime planning decision explicitly depends on bounded callable execution evidence. Do not auto-open any Runtime case or convert the soft signal into workflow automation.
