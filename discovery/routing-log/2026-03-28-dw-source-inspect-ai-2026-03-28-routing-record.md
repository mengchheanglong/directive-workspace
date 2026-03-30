# Discovery Routing Record: Inspect AI

Date: 2026-03-28

- Candidate id: dw-source-inspect-ai-2026-03-28
- Candidate name: Inspect AI
- Routing date: 2026-03-28
- Source type: github-repo
- Decision state: adopt
- Adoption target: engine-owned evaluator and proof-framework patterns
- Route destination: architecture
- Usefulness level: meta
- Usefulness rationale: Meta-usefulness: the retained value is not adopting Inspect AI as a callable host capability but improving how Directive Workspace defines tasks, scorers, tool approval, agent evaluation, and sandbox review boundaries.
- Why this route: Operator override. Engine scored runtime (19), but the retained value under the active mission is not adopting Inspect AI itself as a reusable host capability. The primary adoption target is evaluator/proof framework patterns — tasks, scorers, tool approval, agent evaluation, and sandbox review boundaries — which improve Engine evaluation quality and proof design.
- Why not the alternatives: Runtime would be correct if the goal were to operationalize Inspect AI itself as a callable evaluation service. The bounded Discovery hypothesis is narrower: extract Engine-owned evaluator and proof patterns, keep the source at NOTE depth, and avoid host-capability adoption until later evidence explicitly justifies that shift.
- Handoff contract used: n/a
- Receiving track owner: architecture
- Required next artifact: architecture/02-experiments/2026-03-28-dw-source-inspect-ai-2026-03-28-engine-handoff.md
- Re-entry/Promotion trigger conditions: adaptation_complete, engine_boundary_preserved, decision_review
- Review cadence: before any deeper Architecture experiment or runtime adoption
- Linked intake record: discovery/intake/2026-03-28-dw-source-inspect-ai-2026-03-28-intake.md
- Linked triage record: discovery/triage/2026-03-28-dw-source-inspect-ai-2026-03-28-triage.md
