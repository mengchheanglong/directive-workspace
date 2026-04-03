# Discovery Routing Record: Roam-code

Date: 2026-03-31

- Candidate id: dw-source-roam-code-2026-03-31
- Candidate name: Roam-code
- Routing date: 2026-03-31
- Source type: github-repo
- Decision state: adopt
- Adoption target: engine-owned product logic
- Route destination: architecture
- Usefulness level: meta
- Usefulness rationale: Meta-usefulness: the source may improve how Directive Workspace agents understand repo structure, lane boundaries, and control surfaces before they open downstream work.
- Why this route: Phase A / Phase 2 is explicitly authorized, and the highest-ROI next move is one Architecture-owned local-first spike plan that tests Roam-code against current Engine, dw-state, and control/report truth without executing adoption yet.
- Why not the alternatives: Discovery already preserved the source in Phase A / Phase 1, so keeping it in monitor would no longer add value. Runtime is not justified because the current question is still about Architecture intelligence for agents, not reusable runtime delivery. Backstage and Temporal remain parked behind the phased gate.
- Handoff contract used: shared/contracts/discovery-to-architecture.md
- Receiving track owner: architecture
- Required next artifact: architecture/02-experiments/2026-03-31-dw-source-roam-code-2026-03-31-engine-handoff.md
- Re-entry/Promotion trigger conditions: adaptation_complete, improvement_complete, engine_boundary_preserved, decision_review
- Review cadence: before any Phase A / Phase 3 execution or promotion
- Linked intake record: discovery/intake/2026-03-31-dw-source-roam-code-2026-03-31-intake.md
- Linked triage record: discovery/triage/2026-03-31-dw-source-roam-code-2026-03-31-triage.md

