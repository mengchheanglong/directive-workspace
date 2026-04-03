# Discovery Routing Record: dependency-cruiser Rules Reference

Date: 2026-03-30

- Candidate id: dw-source-dependency-cruiser-rules-reference-2026-03-30
- Candidate name: dependency-cruiser Rules Reference
- Routing date: 2026-03-30
- Source type: product-doc
- Decision state: adopt
- Adoption target: engine-owned product logic
- Route destination: architecture
- Why this route: Recommended architecture because the extracted value is a bounded Engine-structure boundary rule around the canonical `dw-state` facade, not a reusable runtime capability.
- Why not the alternatives: The source does not produce user-facing runtime behavior. It is about protecting internal Engine structure, canonical read-surface ownership, and private implementation boundaries. Discovery should not retain it because the adoption target is already clear.
- Handoff contract used: n/a
- Receiving track owner: architecture
- Required next artifact: architecture/02-experiments/2026-03-30-dw-source-dependency-cruiser-rules-reference-2026-03-30-engine-handoff.md
- Re-entry/Promotion trigger conditions: adaptation_complete, engine_boundary_preserved, decision_review
- Review cadence: before any downstream execution or promotion
- Linked intake record: discovery/intake/2026-03-30-dw-source-dependency-cruiser-rules-reference-2026-03-30-intake.md
- Linked triage record: discovery/triage/2026-03-30-dw-source-dependency-cruiser-rules-reference-2026-03-30-triage.md
