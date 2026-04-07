# Implementation Target: OpenClaw Maintenance Watchdog Signal Lane (2026-03-30)

## target
- Candidate id: `dw-openclaw-maintenance-watchdog-signal-lane`
- Candidate name: OpenClaw Maintenance Watchdog Signal Lane
- Source adoption artifact: `architecture/02-adopted/2026-03-22-openclaw-maintenance-watchdog-signal-lane-adopted.md`
- Paired adoption decision artifact: not recorded for this legacy adopted slice.
- Source bounded result artifact: `architecture/01-experiments/2026-03-22-openclaw-maintenance-watchdog-signal-lane-slice-01.md`
- Usefulness level: `meta`
- Artifact type intent: `shared-lib`
- Final adoption status: `product_materialized`
- Target approval: `directive-lead-implementer`

## objective (what to build)
- Build target: one Directive-owned shared library implementation slice.
- Objective retained: Materialize one OpenClaw-specific maintenance/watchdog signal adapter helper that normalizes the bounded degraded-state signal into canonical Discovery submission-router input without moving degraded-state detection, queue submission, or routing authority out of Discovery.
- Materialization basis: The contract, schema, root helper, and Mission Control checker already prove the maintenance/watchdog signal lane exists, but the signal-to-Discovery normalization boundary is still implicit inside non-Directive scripts and host starter code instead of being exposed as one explicit product-owned adapter seam inside Directive Workspace.

## source decision envelope
- Decision format: `legacy_adopted_markdown`
- Source completion status: `product_materialized`
- Source verification method: `not_recorded`
- Source verification result: `not_recorded`
- Source runtime threshold check: not recorded

## source adoption resolution
- Source verdict: `adopt`
- Source readiness passed: yes
- Source Runtime handoff required: no
- Source Runtime handoff rationale: none recorded
- Source artifact path: `shared/contracts/openclaw-maintenance-watchdog-signal.md`
- Source primary evidence path: `shared/schemas/openclaw-maintenance-watchdog-signal.schema.json`
- Source self-improvement category: not recorded
- Source self-improvement verification method: `not_recorded`
- Source self-improvement verification result: `not_recorded`

### failed readiness checks
- none

## selected tactical slice
- Add one OpenClaw-specific shared helper that consumes the bounded maintenance/watchdog signal contract and returns canonical `DiscoverySubmissionRequest` input with queue-only semantics.
- Keep required and optional field meanings aligned with `shared/contracts/openclaw-maintenance-watchdog-signal.md` and `shared/schemas/openclaw-maintenance-watchdog-signal.schema.json`.
- Keep degraded-state detection, queue submission, route choice, and downstream record creation in the existing OpenClaw helper plus canonical Discovery submission router; this slice may normalize already-computed signal payload into that boundary but must not replace it.

## mechanical success criteria
- One bounded shared helper can accept the current OpenClaw maintenance/watchdog signal shape and return one canonical `DiscoverySubmissionRequest`-compatible object with queue-only semantics.
- Focused verification proves the helper preserves required signal fields, capability-gap null handling, and queue-only defaults without mutating queue, routing, worklist, or host state.
- Focused verification proves the helper does not choose Runtime or Architecture routes directly and does not bypass the Discovery submission router.

## explicit limitations
- Stay within one OpenClaw-specific shared library slice.
- Do not reimplement degraded-state detection, stale-file polling, scheduling, webhook emission, or automatic upstream submission.
- Do not change Discovery routing authority or queue mutation semantics.
- Do not open a host-admin seam, planner wiring, Runtime work, or normal user-facing execution.

## scope (bounded)
- Keep this to one Architecture-owned implementation slice over the existing maintenance/watchdog signal contract.
- Expose one explicit product-owned adapter boundary instead of leaving maintenance/watchdog signal interpretation implicit across scripts and host code.
- Stop at the helper plus focused proof; do not broaden into live degraded-state simulation or broader Discovery intake refactoring.

## inputs
- Primary adopted product artifact: `shared/contracts/openclaw-maintenance-watchdog-signal.md`
- Canonical schema: `shared/schemas/openclaw-maintenance-watchdog-signal.schema.json`
- Canonical unified router: `shared/lib/discovery-submission-router.ts`
- Existing OpenClaw submission adapter: `shared/lib/openclaw-discovery-submission-adapter.ts`
- Existing host-neutral starter signal adapter: `hosts/integration-kit/starter/discovery-signal-adapter.template.ts`
- Root helper: `C:/Users/User/.openclaw/scripts/submit-openclaw-maintenance-watchdog-signal.ps1`
- Host checker: `C:/Users/User/.openclaw/workspace/mission-control/scripts/check-openclaw-maintenance-watchdog-signal.ts`
- Mission reference: `knowledge/active-mission.md`
- Adoption artifact: `architecture/02-adopted/2026-03-22-openclaw-maintenance-watchdog-signal-lane-adopted.md`
- Adoption decision artifact: not recorded for this legacy adopted slice.
- Source bounded result artifact: `architecture/01-experiments/2026-03-22-openclaw-maintenance-watchdog-signal-lane-slice-01.md`

## constraints
- Preserve explicit human review before any downstream Runtime or Architecture work.
- Keep OpenClaw limited to Discovery submission only; do not let this target route directly to Runtime or Architecture.
- Do not execute or mutate host code from this target artifact alone.
- Rollback boundary: Delete this implementation target and any paired implementation result, then continue from the adopted artifact if this adapter boundary proves unnecessary or misleading.

## validation approach
- `decision_review`
- `openclaw_maintenance_watchdog_signal_adapter_contract_check`
- `discovery_authority_preserved`
- `queue_only_default_preserved`
- `bounded_degraded_signal_normalization_only`
- This legacy adopted slice does not retain a bounded-result/start/run chain, so validate against the adopted artifact and retained product artifacts directly.
- Confirm the implementation target still matches the adopted artifact and retained maintenance/watchdog signal mechanism.
- Confirm the target remains one bounded slice and does not imply host expansion or execution automation.

## expected outcome
- One explicit Architecture implementation target that defines one Directive-owned OpenClaw maintenance/watchdog signal adapter slice without reconstructing the adoption chain by hand.
- No execution or host exposure change is triggered from this artifact.
- The new target is now retained at `architecture/04-implementation-targets/2026-03-22-openclaw-maintenance-watchdog-signal-lane-implementation-target.md`.

