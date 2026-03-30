# Implementation Target: OpenClaw Discovery Submission Flow (2026-03-29)

## target
- Candidate id: `dw-openclaw-discovery-submission-flow`
- Candidate name: OpenClaw Discovery Submission Flow
- Source adoption artifact: `architecture/03-adopted/2026-03-22-openclaw-discovery-submission-flow-adopted.md`
- Paired adoption decision artifact: not recorded for this legacy adopted slice.
- Source bounded result artifact: not retained in this legacy adopted slice.
- Usefulness level: `meta`
- Artifact type intent: `shared-lib`
- Final adoption status: `product_materialized`
- Target approval: `directive-lead-implementer`

## objective (what to build)
- Build target: one Directive-owned shared library implementation slice.
- Objective retained: Materialize one OpenClaw-specific submission adapter helper that normalizes and validates the bounded OpenClaw-to-Discovery payload into canonical Discovery submission-router input without moving routing authority out of Discovery.
- Materialization basis: The contract, schema, root helper, and Mission Control checker already prove the submission path exists, but the OpenClaw-specific payload boundary is still implicit across non-Directive surfaces instead of being exposed as one explicit product-owned adapter seam inside Directive Workspace.

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
- Source artifact path: `shared/contracts/openclaw-to-discovery.md`
- Source primary evidence path: `shared/schemas/openclaw-discovery-submission.schema.json`
- Source self-improvement category: not recorded
- Source self-improvement verification method: `not_recorded`
- Source self-improvement verification result: `not_recorded`

### failed readiness checks
- none

## selected tactical slice
- Add one OpenClaw-specific shared helper that consumes the bounded OpenClaw submission payload shape and returns canonical `DiscoverySubmissionRequest` input for the existing submission router.
- Keep required and optional field meanings aligned with `shared/contracts/openclaw-to-discovery.md` and `shared/schemas/openclaw-discovery-submission.schema.json`.
- Keep queue submission, route choice, and downstream record creation in the existing canonical submission router; this slice may prepare input for that router but must not replace it.

## mechanical success criteria
- One bounded shared helper can accept the current OpenClaw submission contract fields and return a canonical `DiscoverySubmissionRequest`-compatible object with the same bounded semantics.
- Focused verification proves the helper preserves required fields, optional fields, and queue-only defaults without mutating queue, routing, or host state.
- Focused verification proves the helper does not choose Runtime or Architecture routes directly and does not bypass the Discovery submission router.

## explicit limitations
- Stay within one OpenClaw-specific shared library slice.
- Do not change Discovery routing authority or queue mutation semantics.
- Do not open a host-admin seam, webhook path, Telegram bridge, or automatic upstream submission path.
- Do not broaden into planner wiring, Runtime work, or normal user-facing execution.

## scope (bounded)
- Keep this to one Architecture-owned implementation slice over the existing OpenClaw-to-Discovery contract.
- Expose one explicit product-owned adapter boundary instead of leaving the OpenClaw submission payload interpretation implicit across scripts and host code.
- Stop at the helper plus focused proof; do not broaden into host-route redesign or broader Discovery intake refactoring.

## inputs
- Primary adopted product artifact: `shared/contracts/openclaw-to-discovery.md`
- Canonical schema: `shared/schemas/openclaw-discovery-submission.schema.json`
- Canonical unified router: `shared/lib/discovery-submission-router.ts`
- Root helper: `C:/Users/User/.openclaw/scripts/submit-openclaw-discovery-candidate.ps1`
- Host checker: `C:/Users/User/.openclaw/workspace/mission-control/scripts/check-openclaw-discovery-submission.ts`
- Mission Control service seam: `C:/Users/User/.openclaw/workspace/mission-control/src/server/services/directive-discovery-submission-service.ts`
- Mission reference: `knowledge/active-mission.md`
- Adoption artifact: `architecture/03-adopted/2026-03-22-openclaw-discovery-submission-flow-adopted.md`
- Adoption decision artifact: not recorded for this legacy adopted slice.
- Source bounded result artifact: not retained in this legacy adopted slice.

## constraints
- Preserve explicit human review before any downstream Runtime or Architecture work.
- Keep OpenClaw limited to Discovery submission only; do not let this target route directly to Runtime or Architecture.
- Do not execute or mutate host code from this target artifact alone.
- Rollback boundary: Delete this implementation target and any paired implementation result, then continue from the adopted artifact if this adapter boundary proves unnecessary or misleading.

## validation approach
- `decision_review`
- `openclaw_submission_adapter_contract_check`
- `discovery_authority_preserved`
- `queue_only_default_preserved`
- This legacy adopted slice does not retain a bounded-result/start/run chain, so validate against the adopted artifact and retained product artifacts directly.
- Confirm the implementation target still matches the adopted artifact and retained OpenClaw-to-Discovery mechanism.
- Confirm the target remains one bounded slice and does not imply host expansion or execution automation.

## expected outcome
- One explicit Architecture implementation target that defines one Directive-owned OpenClaw submission adapter slice without reconstructing the adoption chain by hand.
- No execution or host exposure change is triggered from this artifact.
- The new target is now retained at `architecture/04-implementation-targets/2026-03-22-openclaw-discovery-submission-flow-implementation-target.md`.

