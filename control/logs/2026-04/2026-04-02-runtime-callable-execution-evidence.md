# 2026-04-02 - Runtime Callable Execution Evidence

## Slice

- Era: `Era C - Make Feedback Real`
- Slice: `C1 - collect execution evidence`
- Owning lane: `Runtime`
- Result: repo-root callable execution history is now a canonical evidence surface

## What changed

- Added one shared callable-execution evidence reader:
  - `shared/lib/runtime-callable-execution-evidence.ts`
- Added one report surface:
  - `npm run report:runtime-callable-execution-evidence`
- Added one checker:
  - `npm run check:runtime-callable-execution-evidence`
- Persisted one bounded callable execution history under:
  - `runtime/callable-executions/`

## Resulting truth

- Runtime callable executions are no longer only checker-local proof.
- Repo-root evidence now records:
  - one Scientify callable success
  - one code-normalizer callable success
  - one code-normalizer validation failure
- The evidence report exposes:
  - per-capability execution counts
  - success/failure status counts
  - duration observations
  - one failure-pattern summary

## Proof path

- `npm run report:runtime-callable-execution-evidence`
- `npm run check:runtime-callable-execution-evidence`
- `npm run check:runtime-callable-execution-surface`
- `npm run check`

## Rollback

Revert:

- `shared/lib/runtime-callable-execution-evidence.ts`
- `scripts/report-runtime-callable-execution-evidence.ts`
- `scripts/check-runtime-callable-execution-evidence.ts`
- `runtime/callable-executions/`
- `package.json`
- this log

## Stop-line

Stop once callable execution evidence is queryable through one canonical report/check surface. Do not claim that evidence already changes later planning until a later bounded decision surface actually consumes it.
