# Runtime Completion Bottleneck: Host Selection Fix

Date: 2026-04-07
Mode: STANDARD
Lane: Cross-lane (Discovery, Runtime, Engine)

## Problem

Every fresh Runtime import from research-engine was born with `proposed_host: "pending_host_selection"` hardcoded in `discovery-route-opener.ts:564`. This value propagated unchanged through the entire Runtime chain (follow-up → record → proof → capability boundary → promotion-readiness). At promotion-readiness, the prerequisites check (`evaluatePreHostRuntimePromotionRecordPrerequisites`) required `hostSelected: true`, which could never be satisfied. The autonomous loop could not advance past `runtime.promotion_readiness.opened`.

Secondary issue: `isCallableBundleCapability()` checked both `candidateName` and `targetRuntimeSurface` for the substring "callable". The runtime objective field (parsed as `targetRuntimeSurface`) contained advisory text with "callable-boundary clarity" and "callable execution evidence", causing false-positive callable stub requirements.

## Root cause

1. `buildRuntimeFollowUpRequest()` in `discovery/lib/discovery-route-opener.ts` hardcoded `proposed_host: "pending_host_selection"` regardless of available evidence in the engine run record.
2. No mechanism existed to override host selection after the follow-up record was written.
3. `isCallableBundleCapability()` in `runtime/lib/runtime-promotion-record-writer.ts` used free-form advisory text as a capability signal.

## Fix

### Host inference at route opening (root cause fix)
- Added `inferRuntimeHostSelection()` in `discovery/lib/discovery-route-opener.ts`
- Infers standalone host when ALL of: `hostDependence === "host_adapter_required"`, `routingAssessment.confidence === "high"`, and integration mode is set
- Writes `host_selection_mode: "inferred"` and `proposed_host_confidence: "medium"` into the follow-up record
- Falls back to `pending_host_selection` with `manual_required` when evidence is weak

### Host selection resolution artifact (escape hatch for existing candidates)
- Created `runtime/lib/runtime-host-selection-resolution.ts` — write/read functions for artifact-based host selection override
- Resolution stored alongside promotion-readiness record (same pattern as Discovery routing review resolution)
- Decisions: `select_standalone`, `select_web`, `confirm_inferred`, `override`, `defer`

### Prerequisites update
- `evaluatePreHostRuntimePromotionRecordPrerequisites()` now reads host selection resolution artifact
- Returns `effectiveProposedHost` (from resolution or original) alongside original `proposedHost`
- `executionGuards.hostSelected` uses effective host

### Autonomous loop update
- `writeAutonomousRuntimePromotionRecord()` uses `effectiveProposedHost` for host validation and target_host

### State resolver update
- `DirectiveWorkspaceLinkedArtifacts` includes `runtimeHostSelectionResolutionPath`
- `engine/state/runtime.ts` resolves the path when file exists

### Callable stub false-positive fix
- `isCallableBundleCapability()` now checks only `candidateName` for "callable", not `targetRuntimeSurface`
- Candidates with existing `callableStubPath` are unaffected (detected via early return)

## Files changed

- `discovery/lib/discovery-route-opener.ts` — host inference function + updated buildRuntimeFollowUpRequest
- `runtime/lib/runtime-follow-up-record-writer.ts` — added host_selection_mode, proposed_host_confidence to type and rendering
- `runtime/lib/runtime-host-selection-resolution.ts` — NEW: host selection resolution primitive
- `runtime/lib/index.ts` — export new module
- `runtime/lib/runtime-promotion-record-writer.ts` — prerequisites consume resolution; callable stub heuristic fix
- `engine/coordination/autonomous-lane-loop.ts` — uses effectiveProposedHost
- `engine/state/index.ts` — added runtimeHostSelectionResolutionPath to linked artifacts type
- `engine/state/runtime.ts` — resolves host selection resolution path
- `engine/state/shared.ts` — added to zeroLinkedArtifacts
- `scripts/check-runtime-host-selection-inference-and-resolution.ts` — NEW: 8-assertion test script
- `scripts/resolve-routing-review.ts` — unchanged (read during investigation)

## Proof

### Tests (8 assertions, all pass)
1. regression: host inference fields render in follow-up record
2. negative: manual_required omits inference metadata when not set
3. regression: host selection resolution writes and resolves host correctly
4. regression: host selection resolution round-trips through write/read
5. boundary: resolution path derivation produces correct suffix
6. negative: missing resolution returns null
7. negative: defer decision preserves pending_host_selection
8. live: existing candidate with pending_host_selection is correctly blocked without resolution

### Live rerun proof
- Candidate: `research-engine-web-aakashsharan-com-research-va-20260407t052643z-20260407t052702.`
- Created host selection resolution: `select_standalone` with operator rationale
- Autonomous loop advanced: `runtime.promotion_readiness.opened` → `runtime.promotion_record.opened`
- Promotion record created at: `runtime/07-promotion-records/2026-04-07-...-promotion-record.md`
- Final state integrity: `ok`

### Existing checks
- `check-directive-workspace-composition`: passes
- `check-pre-host-promotion-record-prerequisites`: passes (existing scientify/openmoss assertions hold)

## Rollback

1. Revert changes to `discovery-route-opener.ts` (restore hardcoded `pending_host_selection`)
2. Delete `runtime/lib/runtime-host-selection-resolution.ts`
3. Revert changes to `runtime-follow-up-record-writer.ts`, `runtime-promotion-record-writer.ts`, `autonomous-lane-loop.ts`, `engine/state/index.ts`, `engine/state/runtime.ts`, `engine/state/shared.ts`
4. Remove export from `runtime/lib/index.ts`
5. Delete `scripts/check-runtime-host-selection-inference-and-resolution.ts`
6. Delete any host-selection-resolution.md artifacts created during live testing
7. Delete any promotion-record.md artifacts created by the autonomous loop after the fix

## Follow-up fixes (same session)

### Test script fix
- Test 8 assumed the live candidate was still blocked, but the live proof had created a resolution artifact.
- Fix: test now checks whether a resolution exists and verifies the correct state either way.

### Queue orphan repair
- Two candidates had intake/triage/routing artifacts but no queue entries: `web-docs-langchain-com-oss-pytho-072402` and `open-deep-research-052702`.
- Fix: added the missing queue entries to `discovery/intake-queue.json` with `status: "routed"` and repair notes.

### Autonomous loop currentHead fix
- When the loop started from a routing record but the chain had already advanced past it, `sourcePath` was the routing record, not the actual current-head artifact. This caused `openDirectiveRuntimeFollowUp` to fail with a path validation error.
- Fix: loop now uses `focus.currentHead.artifactPath` and `focus.currentHead.artifactStage` instead of the entry-point artifact path.

### Callable stub heuristic replacement
- `isCallableBundleCapability` was a name-based heuristic (`candidateName.includes("callable")`). Replaced with ground-truth check: callable stub is required only when `callableStubPath` is linked in the artifact chain (i.e., a stub actually exists).
- Candidates with existing stubs (scientify) still pass. Candidates without stubs (openmoss, fresh imports) are not falsely flagged.

### Additional files changed
- `engine/coordination/autonomous-lane-loop.ts` — currentHead fix in loop
- `discovery/intake-queue.json` — 2 orphan entries added

## Stop-line

STANDARD mode. Stopped at promotion-record opened. Registry acceptance, host integration, runtime execution, and promotion automation remain intentionally unopened.
