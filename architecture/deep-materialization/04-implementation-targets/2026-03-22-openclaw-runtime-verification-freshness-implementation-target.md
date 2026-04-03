# Implementation Target: OpenClaw Runtime Verification Freshness (2026-03-29)

## target
- Candidate id: `dw-openclaw-runtime-verification-freshness-2026-03-22`
- Candidate name: OpenClaw Runtime Verification Freshness
- Source adoption artifact: `architecture/03-adopted/2026-03-22-openclaw-runtime-verification-freshness-adopted.md`
- Paired adoption decision artifact: not recorded for this legacy adopted slice.
- Source bounded result artifact: not retained in this legacy adopted slice.
- Usefulness level: `meta`
- Artifact type intent: `shared-lib`
- Final adoption status: `product_materialized`
- Target approval: `directive-lead-implementer`

## objective (what to build)
- Build target: one Directive-owned shared library implementation slice.
- Objective retained: Materialize one OpenClaw-specific runtime-verification signal adapter helper that normalizes the bounded stale-verification signal into canonical Discovery submission-router input without moving stale-file evaluation, queue submission, or routing authority out of Discovery.
- Materialization basis: The contract, schema, root helper, and Mission Control checker already prove the stale-runtime-verification signal path exists, but the signal-to-Discovery normalization boundary is still implicit inside non-Directive scripts instead of being exposed as one explicit product-owned adapter seam inside Directive Workspace.

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
- Source artifact path: `shared/contracts/openclaw-runtime-verification-signal.md`
- Source primary evidence path: `shared/schemas/openclaw-runtime-verification-signal.schema.json`
- Source self-improvement category: not recorded
- Source self-improvement verification method: `not_recorded`
- Source self-improvement verification result: `not_recorded`

### failed readiness checks
- none

## selected tactical slice
- Add one OpenClaw-specific shared helper that consumes the bounded runtime-verification signal contract and returns canonical `DiscoverySubmissionRequest` input only when the signal is already detected.
- Keep required and optional field meanings aligned with `shared/contracts/openclaw-runtime-verification-signal.md` and `shared/schemas/openclaw-runtime-verification-signal.schema.json`.
- Keep stale-file evaluation, queue submission, route choice, and downstream record creation in the existing OpenClaw helper plus canonical Discovery submission router; this slice may normalize already-computed signal payload into that boundary but must not replace it.

## mechanical success criteria
- One bounded shared helper can accept the current OpenClaw runtime-verification signal shape and return either no submission when `signal_detected = false` or one canonical `DiscoverySubmissionRequest`-compatible object with queue-only semantics when `signal_detected = true`.
- Focused verification proves the helper preserves required signal fields, bounded stale reasons, and queue-only defaults without mutating queue, routing, worklist, or host state.
- Focused verification proves the helper does not choose Runtime or Architecture routes directly and does not bypass the Discovery submission router.

## explicit limitations
- Stay within one OpenClaw-specific shared library slice.
- Do not reimplement stale-file detection, scheduling, webhook emission, or automatic upstream submission.
- Do not change Discovery routing authority or queue mutation semantics.
- Do not open a host-admin seam, planner wiring, Runtime work, or normal user-facing execution.

## scope (bounded)
- Keep this to one Architecture-owned implementation slice over the existing runtime-verification signal contract.
- Expose one explicit product-owned adapter boundary instead of leaving stale-verification signal interpretation implicit across scripts and host code.
- Stop at the helper plus focused proof; do not broaden into report-freshness scheduling or broader Discovery intake refactoring.

## inputs
- Primary adopted product artifact: `shared/contracts/openclaw-runtime-verification-signal.md`
- Canonical schema: `shared/schemas/openclaw-runtime-verification-signal.schema.json`
- Canonical unified router: `shared/lib/discovery-submission-router.ts`
- Existing OpenClaw submission adapter: `shared/lib/openclaw-discovery-submission-adapter.ts`
- Root helper: `C:/Users/User/.openclaw/scripts/submit-openclaw-runtime-verification-signal.ps1`
- Host checker: `C:/Users/User/.openclaw/workspace/mission-control/scripts/check-openclaw-runtime-verification-signal.ts`
- Mission reference: `knowledge/active-mission.md`
- Adoption artifact: `architecture/03-adopted/2026-03-22-openclaw-runtime-verification-freshness-adopted.md`
- Adoption decision artifact: not recorded for this legacy adopted slice.
- Source bounded result artifact: not retained in this legacy adopted slice.

## constraints
- Preserve explicit human review before any downstream Runtime or Architecture work.
- Keep OpenClaw limited to Discovery submission only; do not let this target route directly to Runtime or Architecture.
- Do not execute or mutate host code from this target artifact alone.
- Rollback boundary: Delete this implementation target and any paired implementation result, then continue from the adopted artifact if this adapter boundary proves unnecessary or misleading.

## validation approach
- `decision_review`
- `openclaw_runtime_verification_signal_adapter_contract_check`
- `discovery_authority_preserved`
- `queue_only_default_preserved`
- `no_submission_when_signal_absent`
- This legacy adopted slice does not retain a bounded-result/start/run chain, so validate against the adopted artifact and retained product artifacts directly.
- Confirm the implementation target still matches the adopted artifact and retained OpenClaw runtime-verification mechanism.
- Confirm the target remains one bounded slice and does not imply host expansion or execution automation.

## expected outcome
- One explicit Architecture implementation target that defines one Directive-owned OpenClaw runtime-verification signal adapter slice without reconstructing the adoption chain by hand.
- No execution or host exposure change is triggered from this artifact.
- The new target is now retained at `architecture/04-implementation-targets/2026-03-22-openclaw-runtime-verification-freshness-implementation-target.md`.
