# Experimental Structural Mapping Sidecar Schema

- Experimental status: `non-authoritative sidecar`
- Scope: `structural usefulness cases only`
- Live integration status: `none`
- Current anchor cases:
  - `dw-source-ts-edge-2026-03-27`
  - `dw-source-scientify-research-workflow-plugin-2026-03-27`

## purpose

This schema experiment exists to test structural transfer reasoning only where the repo already showed that current bounded-result language is not quite sharp enough.

It is for cases where the real question is:
- what relation transfers
- what does not transfer
- where source-specific baggage begins
- where false analogy risk lives

It is not a live system field and not a new truth surface.

## where this belongs

- sidecar-only experimental documentation
- structural usefulness cases
- mixed-value partition cases
- future bounded schema evaluation only if it keeps saying something sharper than current bounded-result language

## where this does not belong

- live Discovery routing
- planner recommendation logic
- Runtime execution
- `shared/lib/dw-state.ts`
- `scripts/report-directive-workspace-state.ts`
- NOTE-mode review sources where ordinary bounded-result language is already clear enough

## required discipline

Main rule:
- no structural mapping counts unless it captures relations, not just attributes

Minimum fields for a valid sidecar:
- `problem_class`
- `source_structure`
- `target_structure`
- `relational_correspondence`
- `transferable_relation`
- `transfer_conditions`
- `non_transfer_conditions`
- `source_specific_baggage`
- `false_analogy_risk`
- `blueprint_confidence`

Optional fields when they clarify something real:
- `control_pattern`
- `transformation_pattern`
- `evidence_pattern`
- `adaptation_notes`

## required output shape

Each structural-mapping sidecar should include:
- explicit experimental labeling
- anchor artifact links
- one concrete transferable relation
- one concrete non-transfer boundary
- one concrete source-specific baggage boundary
- one explicit false-analogy warning
- one short statement of what this sidecar says more sharply than the current bounded-result language

## anti-drift

- do not make this mandatory for all sources
- do not create a new lane for this
- do not use elegant language as a substitute for sharper reasoning
- do not promote this into authority without a later explicit bounded decision
