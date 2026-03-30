# Experimental Structural Mapping Sidecar: ts-edge Type-Safe Graph Workflow Engine

- Experimental status: `non-authoritative sidecar`
- Structural mapping status: `experimental`
- Live integration status: `none`
- Case scope: `structural usefulness case only`
- Anchor candidate id: `dw-source-ts-edge-2026-03-27`
- Anchor artifacts:
  - `discovery/routing-log/2026-03-27-dw-source-ts-edge-2026-03-27-routing-record.md`
  - `architecture/02-experiments/2026-03-27-dw-source-ts-edge-2026-03-27-engine-handoff.md`
  - `architecture/02-experiments/2026-03-27-dw-source-ts-edge-2026-03-27-bounded-result.md`

## structural mapping

- `problem_class`: typed stage orchestration for Engine-owned pipeline chaining
- `source_structure`: node -> edge -> compile -> run, where legal edges determine which stage outputs can feed downstream stages
- `target_structure`: `processSource()` stage chain where extraction, adaptation, improvement, proof, and integration should consume typed upstream outputs instead of one flat planning input
- `relational_correspondence`: the real match is not "graph workflow engine" in general; it is the relation between upstream stage output contracts and downstream stage input legality
- `transferable_relation`: explicit edge-level legality between stage outputs and downstream inputs
- `control_pattern`: stage progression only through declared compatible boundaries
- `transformation_pattern`: replace flat shared planning input with progressive typed stage-output handoff
- `evidence_pattern`: contract mismatch should fail at stage-boundary definition time instead of leaking into later planning stages
- `transfer_conditions`:
  - keep the target fully Engine-owned
  - treat ts-edge as evidence for stage-boundary discipline, not as a dependency target
  - preserve bounded staged progression rather than generic workflow-engine ambition
- `non_transfer_conditions`:
  - do not adopt ts-edge itself as Runtime capability
  - do not import builder-style graph generality just because the source has it
  - do not treat branching/parallel/merge features as automatically needed in Directive Workspace
- `source_specific_baggage`:
  - generic workflow-engine packaging
  - builder API affordances
  - reusable library concerns that are broader than the actual Engine gap
- `false_analogy_risk`: moderate if "typed graph" is treated as the goal instead of explicit stage-boundary legality
- `blueprint_confidence`: high

## sharper than current bounded-result language

What this says more sharply than the current bounded result:
- the transferable unit is not "typed graph chaining" in the abstract
- the transferable unit is the explicit legality relation between one stage output contract and the next stage input contract

That sharper statement matters because it narrows future work away from adopting a workflow-engine shape and toward fixing the concrete `processSource()` flat-input problem already identified in the bounded result.

## why this sidecar is useful

- it separates the useful relation from the source's general library surface
- it makes the non-transfer boundary concrete
- it provides a falsifiable warning against overgeneralizing from a workflow-engine source

## why this sidecar is not authority

- it does not change routing
- it does not change `dw-state.ts`
- it does not change `report-directive-workspace-state.ts`
- it does not authorize DEEP implementation or any live Engine change
