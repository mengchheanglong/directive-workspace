# Engine Next-Step Legality Validation Hardening Engine-Routed Architecture Experiment

Date: 2026-03-27
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-pressure-engine-next-step-legality-validation-hardening-2026-03-27`
- Source reference: `scripts/report-directive-workspace-state.ts`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-live-mini-swe-agent-engine-pressure-2026-03-24-058854ee.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-24T00-00-00-000Z-dw-live-mini-swe-agent-engine-pressure-2026-03-24-058854ee.md`
- Discovery routing record: `discovery/routing-log/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-routing-record.md`
- Primary truth surface: `shared/lib/dw-state.ts`
- Integrity gate surface: `engine/workspace-truth.ts`
- Composition checker: `scripts/check-directive-workspace-composition.ts`
- Concrete pressure example: `discovery/routing-log/2026-03-24-dw-live-mini-swe-agent-engine-pressure-2026-03-24-routing-record.md`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: shared Engine truth currently carries the highest-value whole-product seam in negative-path validation hardening, and the first bounded slice is next-step legality validation for Discovery-routed downstream stubs.

## Objective

Open one bounded DEEP Architecture slice that hardens Discovery-route legality validation so a concrete required downstream artifact mismatch blocks advancement instead of surfacing a falsely legal downstream next step.

## Bounded scope

- Keep this at one shared Engine/truth-quality slice.
- Restrict the rule to Discovery route legality only.
- Distinguish descriptive `Required next artifact` labels from concrete artifact references.
- Block only concrete required-downstream mismatches.
- Do not broaden into general broken-link scanning or stale-status repair.

## Inputs

- `shared/lib/dw-state.ts` currently resolves Discovery-route next-step truth.
- `engine/artifact-link-validation.ts` currently treats any required-next-artifact string as missing if it is not on disk.
- `scripts/check-directive-workspace-composition.ts` already proves negative-path blocking for queue mismatches and missing linked artifacts, but not for required-next-artifact mismatches.

## Validation gate(s)

- `legality_guard_complete`
- `discovery_route_scope_preserved`
- `decision_review`

## Lifecycle classification

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Rollback

Revert the Discovery-route legality guard changes in `shared/lib/dw-state.ts`, `engine/artifact-link-validation.ts`, and `scripts/check-directive-workspace-composition.ts`, then delete this DEEP case chain.

## Next decision

- `adopt`
