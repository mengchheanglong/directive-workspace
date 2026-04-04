# Post-Optimization Usefulness Frontier

Date: 2026-04-04

## Scope

Follow-through on the post-optimization usefulness frontier after the earlier code-dedup and check-speed program.

## Completed slices

### 1. Knowledge surface consolidation

- active authority now points to:
  - `CLAUDE.md`
  - `control/runbook/current-priority.md`
  - `knowledge/README.md`
- active entry surfaces no longer present `knowledge/doctrine.md`, `knowledge/workflow.md`, or `knowledge/execution-plan.md` as peer authority
- overlapping planning/doctrine docs remain preserved as historical/reference context rather than deleted live links

Reference log:
- `control/logs/2026-04/2026-04-04-knowledge-surface-consolidation.md`

### 2. DW web-host promotion guard dedup

- the seven `shared/contracts/*-dw-web-host-runtime-promotion-guard.md` files are now backed by:
  - `scripts/dw-web-host-runtime-promotion-guard-registry.ts`
  - `scripts/render-dw-web-host-runtime-promotion-guards.ts`
- canonical contract paths remain unchanged
- repeated manual edits across that contract family are no longer required

### 3. Engine routing signal improvement

- `DirectiveEngineSourceItem` now accepts bounded structured routing metadata:
  - `primaryAdoptionTarget`
  - `containsExecutableCode`
  - `containsWorkflowPattern`
- the Engine normalizes and consumes those signals in:
  - `engine/directive-engine.ts`
  - `engine/routing.ts`
  - `engine/usefulness.ts`
- discovery-submission surfaces now accept the equivalent request fields:
  - `primary_adoption_target`
  - `contains_executable_code`
  - `contains_workflow_pattern`
- the stage-chaining checker now proves one concrete metadata-over-keyword case:
  - an Architecture-skewing repo title still routes to Runtime when the structured metadata says the primary adoption target is runtime capability

### 4. Architecture deep-tail linkage index

- added `shared/lib/architecture-deep-tail-linkage-index.ts`
- deep-tail lifecycle writers now record source-to-downstream links into `architecture/deep-materialization/linkage-index.json`
- `shared/lib/dw-state.ts` now checks that linkage index before falling back to directory scans
- compatibility fallback remains in place, so old artifacts still resolve even before the index is warm

## Truth-audited closures

### Runtime core contracts

The broad claim that `runtime/core/` had no runtime consumers was false.

Verified live consumers include:
- `hosts/standalone-host/runtime-lane.ts`
- `runtime/capabilities/literature-access/executor.ts`
- `shared/lib/runtime-callable-execution-evidence.ts`
- `scripts/check-directive-scientify-runtime-callable.ts`
- `scripts/check-directive-code-normalizer-runtime-callable.ts`
- `scripts/check-runtime-callable-execution-surface.ts`

No broad retirement or move-to-knowledge action is authorized from current repo truth.

### Remaining architecture lifecycle boilerplate

The earlier deep-tail lifecycle scaffolding dedup remains the active completion boundary.

Further collapse into a full generic factory would now be broader refactor pressure rather than the highest-ROI bounded continuation, so it was not reopened in this run.

## Verification

- `npm run check:control-authority`
- `npm run check:directive-engine-stage-chaining`
- `npm run check:architecture-composition`
- `npm run check:architecture-materialization-due-check`
- `npm run check:host-adapter-boundary`
- `npm run check:directive-workspace-composition`
- `npm run check`

## Result

The low-risk/high-value post-optimization usefulness frontier is complete.

What remains from here is broader redesign pressure, not an unfinished bounded cleanup frontier:
- deeper Engine routing model redesign
- broader architecture lifecycle factory redesign
- broader runtime framework redesign
