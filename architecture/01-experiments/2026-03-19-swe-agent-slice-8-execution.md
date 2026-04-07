# SWE-agent Slice 8 Execution (2026-03-19)

## candidate verification
- Candidate: `SWE-agent`
- Intake path: `C:\Users\User\.openclaw\workspace\directive-workspace\sources\deferred-or-rejected\SWE-agent`
- Pinned revision: `bfdcfa5f6c4c974e9fc754445b469a7564b7bb92`
- Describe/tag: `v1.1.0-151-gbfdcfa5f`
- Working tree state: clean (`git status --short` returned empty)

## bounded experiment contract (defined before run)
- Objective: validate extractable **config-governed execution safety + trajectory audit** patterns.
- Timebox: 45 minutes.
- Success criteria:
  1. Config policy includes cost/retry controls.
  2. Execution path persists trajectory/audit steps.
  3. Hook lifecycle extension surface exists.
  4. Pattern can be mapped without importing runtime framework.

## reproducible proof
### scope (read-only)
- `README.md`
- `config/bash_only.yaml`
- `sweagent/agent/agents.py`
- `sweagent/run/hooks/abstract.py`
- `sweagent/run/inspector_cli.py`

### proof output
```json
{
  "explicit_superseded_notice": true,
  "cost_limits_present": true,
  "retry_block_present": true,
  "trajectory_capture": true,
  "retry_handler": true,
  "hook_lifecycle_combiner": true,
  "trajectory_inspector_exists": true,
  "verdict": "pass"
}
```

## extracted pattern candidates
1. **Config-governed budget + retry policy**
- Explicit per-instance/total cost limits and retry blocks.

2. **Trajectory-first auditability**
- Step-level trajectory append and persisted run traces.

3. **Hook-composition extension model**
- Combined run hooks for lifecycle instrumentation.

## mapping to directive workspace
- Candidate pattern maps to stronger experiment policy templates:
  - explicit run-budget controls,
  - retry policy declaration,
  - standardized trace artifact requirements.

## excluded as baggage
- Full coding-agent runtime and toolchain.
- SWE-bench-specific execution stack and task runner surface.
- Runtime replacement of Codex/mini-swe-agent lane.

## integration cost / risk / rollback
- Integration mode: `adapt` (policy extraction only).
- Estimated cost: medium.
- Operational risk: medium due overlap/confusion risk with existing execution lanes if imported directly.
- Rollback:
  1. Remove this execution artifact.
  2. Remove corresponding decision artifact.
  3. No runtime rollback required.
