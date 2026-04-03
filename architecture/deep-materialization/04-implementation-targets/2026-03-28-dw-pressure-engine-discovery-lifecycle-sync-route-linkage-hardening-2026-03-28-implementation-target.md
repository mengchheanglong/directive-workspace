# Implementation Target: Engine Discovery Lifecycle Sync Route-Linkage Hardening (2026-03-28)

## target
- Candidate id: `dw-pressure-engine-discovery-lifecycle-sync-route-linkage-hardening-2026-03-28`
- Candidate name: Engine Discovery Lifecycle Sync Route-Linkage Hardening
- Source adoption artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-discovery-lifecycle-sync-route-linkage-hardening-2026-03-28-adopted-planned-next.md`
- Paired adoption decision artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-discovery-lifecycle-sync-route-linkage-hardening-2026-03-28-adopted-planned-next-adoption-decision.json`
- Source bounded result artifact: `architecture/02-experiments/2026-03-28-dw-pressure-engine-discovery-lifecycle-sync-route-linkage-hardening-2026-03-28-bounded-result.md`
- Usefulness level: `meta`
- Artifact type intent: `shared-lib`
- Final adoption status: `adopt_planned_next`
- Target approval: `directive-lead-implementer`

## objective (what to build)
- Build target: one Directive-owned routed lifecycle sync legality-validation slice.
- Objective retained: require routed lifecycle sync to use a real downstream stub that matches the routing record's declared next artifact when that artifact is a concrete directive-workspace path.

## scope (bounded)
- Limit the implementation to `shared/lib/discovery-intake-lifecycle-sync.ts` and `scripts/check-directive-workspace-composition.ts`.
- Require concrete routed `result_record_path` values to exist before queue mutation.
- Validate routed queue linkage against the routing record's `Route destination` and concrete `Required next artifact`.
- Do not broaden into completed-phase validation, queue lifecycle sync redesign, generic stale-status repair, or broken-link scanning.

## validation approach
- `routed_lifecycle_sync_linkage_guard_complete`
- `routed_lifecycle_sync_scope_preserved`
- `decision_review`
- `workspace_check_ok`
- Confirm correct routed lifecycle sync succeeds when the stub matches the routing record.
- Confirm mismatched routed lifecycle sync is rejected before queue mutation.
- Confirm missing routed concrete stub paths are rejected before queue mutation.
- Confirm `npm run check` passes.

## rollback boundary
- Revert the routed lifecycle sync validation change and remove this DEEP case chain if later queue work needs a different source-side boundary.
