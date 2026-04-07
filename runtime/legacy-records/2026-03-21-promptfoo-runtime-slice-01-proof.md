# Promptfoo Runtime Slice 01 Proof

Date: 2026-03-21
Candidate id: `promptfoo`
Track: `Directive Runtime`
Slice type: bounded runtime evaluation execution

## Run Contract

Source follow-up:
- `runtime/00-follow-up/2026-03-20-promptfoo-runtime-followup.md`

Execution scope:
- one Promptfoo-backed bounded agent eval run through Mission Control
- one eval guard pass/fail check
- one regression check against existing eval history

## Runtime Artifacts

- raw eval output:
  - `C:\Users\User\.openclaw\workspace\mission-control\reports\evals\promptfoo-raw.json`
- latest eval snapshot:
  - `C:\Users\User\.openclaw\workspace\mission-control\reports\evals\latest.json`
- latest eval summary:
  - `C:\Users\User\.openclaw\workspace\mission-control\reports\evals\latest-summary.md`

## Operational Outcomes

- Promptfoo executed successfully through the existing host harness.
- Bounded eval metrics remained above the minimum guard thresholds.
- Regression check passed against the retained eval history window.
- This proves a real Runtime runtime evaluation lane exists without treating the full upstream Promptfoo repo as runtime truth.

## Metric Snapshot

- Quality gate profile: agent_eval_guard/v1
- Promotion profile family: bounded_agent_eval
- Proof shape: agent_eval_guard_snapshot/v1
- Primary host checker: `npm run check:directive-promptfoo-runtime`
- total tests: `7`
- passed: `6`
- failed: `1`
- score: `0.857`
- failure rate: `0.143`
- cost USD: `0`

## Required Gates

- `npm run eval:agents` -> PASS
- `npm run check:agent-evals` -> PASS
- `npm run check:agent-eval-regression` -> PASS
- `npm run check:directive-promptfoo-runtime` -> PASS
- `npm run check:ops-stack` -> PASS

## Keep/Discard Decisions

- `keep`: bounded eval harness behavior through Mission Control host runner
- `keep`: explicit result artifacts and guard thresholds as Runtime promotion input
- `discard`: any implication that the whole upstream Promptfoo feature surface is required or active

## Risk Note

Current callable value is bounded to the existing Mission Control agent eval surface. It should be treated as a promotion-safety lane, not as broad approval to expose arbitrary Promptfoo functionality.

## Rollback

If this slice is rolled back:
- remove promptfoo-specific Runtime record/proof/promotion/registry artifacts
- remove slice-specific Runtime checker wiring
- keep existing Mission Control eval scripts and Architecture evaluation patterns unchanged
