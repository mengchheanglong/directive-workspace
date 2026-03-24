# Paper2Code Stage Schema Normalization

Date: 2026-03-21
Candidate id: `Paper2Code`
Source slice: `2026-03-19-paper2code-directive-architecture-slice.md`

Materialized outputs:
- `shared/schemas/intake-normalized-artifact.schema.json`
- `shared/schemas/analysis-plan-artifact.schema.json`
- `shared/schemas/experiment-design-artifact.schema.json`
- `shared/schemas/integration-contract-artifact.schema.json`
- `shared/schemas/proof-checklist-artifact.schema.json`
- updated `shared/schemas/README.md`

Retained mechanisms:
- explicit stage-contract pipeline
- typed handoff artifacts across the full chain
- source-agnostic normalization of integration/proof stage fields

Directive adaptation rule:
- keep the stage chain product-owned and typed
- do not import Paper2Code runtime behavior
- preserve the handoff model without inheriting shell-runner or model-runtime baggage

Validation hooks:
- `npm run check:directive-architecture-schemas`
- `npm run check:directive-paper2code-contracts`
- `npm run check:ops-stack`

Completion note:
- this closes the remaining Paper2Code normalization gap for the current Architecture cycle
- any future work would be host consumption or optional helper refinement, not missing product-owned structure
