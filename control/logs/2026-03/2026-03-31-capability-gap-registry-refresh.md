# Capability Gap Registry Refresh

Date: 2026-03-31
Affected layer: Discovery capability-gap surface + Engine self-assessment
Owning lane: Discovery
Mode: STANDARD
Slice: capability-gap clarity improvement

## What was done

Updated the stale `capability-gaps.json` registry and regenerated `gap-worklist.json` through the canonical worklist generator to accurately reflect current engine materialization progress.

The capability-gaps.json was last updated 2026-03-24 (7 days stale). The sole remaining unresolved gap (`gap-directive-engine-materialization`) described a `current_state` that materially understated what the engine now owns.

## Changes

### capability-gaps.json
- `updatedAt`: 2026-03-24 -> 2026-03-31
- `gap-directive-engine-materialization.current_state`: Updated to reflect engine now owns canonical state resolution, case planning from mirrored snapshots, negative-path validation (8 slices), structured checker output with failure contracts, checker-definition pilot, canonical-read-surface coverage enforcement, route-supersession logic, and case event tracking. Remaining gaps explicitly named: adaptation/improvement logic not engine-owned, lane boundaries not programmatically enforced, host-adapter seams conceptual.
- `gap-directive-engine-materialization.candidate_ids`: Added 4 recent candidates that contributed to engine materialization.

### gap-worklist.json (regenerated via canonical generator)
- `updatedAt`: 2026-03-24 -> 2026-03-31
- `proof_clarity`: 1 -> 3 (engine now has real proof infrastructure)
- `priority_score`: 113 -> 119 (reflects improved proof_clarity)
- `latest_candidate_id`: updated to `dw-source-roam-code-2026-03-31`
- `latest_result_path`: updated to current architecture handoff artifact

## Why this was the highest-ROI improvement

The maturity table identifies Discovery's main gap as "capability-gap clarity" (not basic flow). The capability-gap registry was 7 days stale with a materially inaccurate current_state for the sole remaining gap. The system could not accurately prioritize its own next moves because its self-assessment surface was outdated.

## Proof path

- Gap worklist regenerated through canonical `generateDiscoveryGapWorklist` (not hand-edited)
- `npm run check:discovery-gap-worklist-selector` passes
- `npm run check` full pipeline passes (exit code 0)

## Rollback path

Revert `discovery/capability-gaps.json` and `discovery/gap-worklist.json` to their previous content.

## Stop-line

Stop after this registry refresh. Do not:
- resolve the gap prematurely (remaining sub-gaps are real)
- split the gap into sub-gaps (that requires a separate decision)
- reopen parked external phases
- update active-mission.md (that requires a separate mission review)
