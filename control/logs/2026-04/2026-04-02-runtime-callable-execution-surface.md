# 2026-04-02 - Runtime Callable Execution Surface

## Slice

- CLAUDE roadmap slice: `era_a_a4_minimal_execution_surface`
- Owning lane: `Runtime`
- Result: the shared Runtime callable executor now has one checker-backed proof surface for both real callable capabilities plus bounded timeout enforcement

## What changed

- Added [scripts/check-runtime-callable-execution-surface.ts](/C:/Users/User/projects/directive-workspace/scripts/check-runtime-callable-execution-surface.ts) to prove the shared executor in [runtime/core/callable-execution.ts](/C:/Users/User/projects/directive-workspace/runtime/core/callable-execution.ts).
- Wired `check:directive-code-normalizer-runtime-callable` and `check:runtime-callable-execution-surface` into [package.json](/C:/Users/User/projects/directive-workspace/package.json).
- Corrected the runtime import surface in [runtime/capabilities/literature-access/index.ts](/C:/Users/User/projects/directive-workspace/runtime/capabilities/literature-access/index.ts) so the canonical literature-access capability exports load under `node --experimental-strip-types`.

## Resulting truth

- The Scientify literature-access callable and the code-normalizer callable both execute through one shared Runtime-owned surface.
- The shared surface persists bounded JSON execution records and markdown execution reports under `runtime/callable-executions/` in checker-owned temp roots.
- Shared timeout enforcement is now directly proved instead of being inferred from capability-local wrappers.

## Proof path

- `npm run check:directive-scientify-runtime-callable`
- `npm run check:directive-code-normalizer-runtime-callable`
- `npm run check:runtime-callable-execution-surface`

## Rollback

Revert:

- [scripts/check-runtime-callable-execution-surface.ts](/C:/Users/User/projects/directive-workspace/scripts/check-runtime-callable-execution-surface.ts)
- the new `package.json` script wiring
- the `.ts` import correction in [runtime/capabilities/literature-access/index.ts](/C:/Users/User/projects/directive-workspace/runtime/capabilities/literature-access/index.ts)

## Stop-line

Stop at one bounded shared execution surface with checker-backed records, reports, and timeout proof. Do not open host integration, runtime automation, or automatic downstream advancement in this slice.
