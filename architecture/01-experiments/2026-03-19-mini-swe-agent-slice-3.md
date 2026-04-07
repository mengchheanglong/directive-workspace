# Integration Slice 3: mini-swe-agent

## objective
Assess whether `mini-swe-agent` can serve as a lightweight fallback execution lane for narrowly scoped repo fixes when Codex lane is saturated.

## bounded experiment steps
1. Define one constrained bug-fix task with a clear pass/fail test.
2. Run `mini-swe-agent` in a sandboxed branch with strict file scope.
3. Compare output quality and operator overhead versus Codex on the same task.

## success criteria
- Agent produces a patch candidate with reproducible verification steps.
- Patch quality is comparable to Codex for the constrained task.
- Overhead (setup + review) stays within accepted time budget.

## risk + rollback
- Risk: medium (duplicate lane complexity and review overhead).
- Rollback: do not merge fallback lane artifacts; remove experiment branch and notes.

## required gates
- `npm run check:directive-v0`
- `npm run check:directive-integration-proof`
- `npm run check:directive-workspace-health`
- `npm run check:ops-stack`
