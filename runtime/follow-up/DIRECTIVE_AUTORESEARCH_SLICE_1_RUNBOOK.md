# Directive Autoresearch Slice 1 Runbook

## Scope
Bounded integration contract for candidate `autoresearch` in Directive Workspace Phase 2.

## Objective
Provide a repeatable operator template for one bounded autoresearch run without changing runtime code paths.

## Execution Contract
Use this exact template when starting a bounded run:

```text
/autoresearch
Goal: Improve one directive workflow metric for a single candidate lifecycle stage
Scope: src/lib/directive-workspace/**, scripts/check-directive-*.ts
Metric: Number of failing directive checks (lower is better)
Direction: Lower is better
Verify: npm run check:directive-v0
Guard: npm run check:ops-stack
Iterations: 3
```

## Operator Rules
1. Keep scope fixed to directive workspace files and check scripts.
2. One focused change per iteration.
3. Record keep/discard result per iteration in experiment notes.
4. Stop immediately on any critical gate failure and rollback the last change.

## Exit Criteria
- A reproducible iteration log exists.
- At least one measurable keep/discard decision is recorded.
- Required directive and ops gates are green.

## Rollback
If this slice is no longer needed, remove this runbook file only.
