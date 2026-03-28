# Engine Legacy Architecture Adoption Compatibility Bounded Architecture Result

- Candidate id: dw-pressure-engine-legacy-architecture-adoption-compatibility-2026-03-28
- Candidate name: Engine Legacy Architecture Adoption Compatibility
- Experiment date: 2026-03-28
- Owning track: Architecture
- Experiment type: engine-routed bounded result
- Closeout approval: not explicitly recorded in the compact bounded result artifact; reconstructed from bounded start `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-architecture-adoption-compatibility-2026-03-28-bounded-start.md`

- Objective: Open one bounded DEEP Architecture slice that makes legacy `architecture/03-adopted/*.md` artifacts canonical current heads without requiring modern adoption decision JSON.
- Bounded scope:
- Keep this at one shared Engine/truth-quality slice.
- Limit the code change to `shared/lib/architecture-result-adoption.ts`.
- Add targeted resolver coverage in `scripts/check-directive-workspace-composition.ts`.
- Parse candidate identity and final-status fallback directly from the legacy adopted markdown when decision JSON is missing.
- Keep queue lifecycle policy, Runtime history support, and generic historical normalization out of scope.
- Inputs:
- `readDirectiveArchitectureAdoptionDetail(...)` currently hard-requires `*-adoption-decision.json`.
- The legacy adopted artifacts above all resolve as direct Architecture adoptions in practice, but they are older than the modern decision sidecar format.
- `readArchitectureUpstreamChainFromAdoption(...)` already tolerates empty source-result linkage, so the missing decision sidecar is the concrete blocker.
- Expected output:
- One bounded Architecture experiment slice that can proceed without reinterpreting the Engine run from scratch.
- Validation gate(s):
- `legacy_architecture_adoption_compatibility_complete`
- `legacy_architecture_adoption_scope_preserved`
- `decision_review`
- Transition policy profile: `decision_review`
- Scoring policy profile: `architecture_self_improvement`
- Blocked recovery path: Leave the routed handoff stub as the authoritative pre-start artifact and stop before adoption.
- Failure criteria: No Directive-owned mechanism or bounded adaptation target becomes clear from the approved handoff scope.
- Rollback: Revert the legacy adoption fallback in `shared/lib/architecture-result-adoption.ts`, revert the checker coverage, and delete this DEEP case chain.
- Result summary: Canonical Architecture truth now keeps the four legacy adopted records reachable as clean adopted current heads instead of treating them as broken historical drift.
- Evidence path:
- Primary evidence path: `shared/lib/architecture-result-adoption.ts`
- Bounded start: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-architecture-adoption-compatibility-2026-03-28-bounded-start.md`
- Handoff stub: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-architecture-adoption-compatibility-2026-03-28-engine-handoff.md`
- Engine run record: `n/a`
- Engine run report: `n/a`
- Discovery routing record: `n/a`
- Closeout decision artifact: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-architecture-adoption-compatibility-2026-03-28-bounded-result-adoption-decision.json`
- Next decision: `adopt`

## Lifecycle classification (per `architecture-artifact-lifecycle` contract)

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Source adaptation fields

- Source analysis ref: architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-architecture-adoption-compatibility-2026-03-28-engine-handoff.md
- Adaptation decision ref: n/a
- Adaptation quality: `skipped`
- Improvement quality: `skipped`
- Meta-useful: `yes`
- Meta-usefulness category: `n/a`
- Transformation artifact gate result: `partial`
- Transformed artifacts produced:
- `shared/lib/architecture-result-adoption.ts`
- `scripts/check-directive-workspace-composition.ts`

## Closeout decision

- Verdict: `adopt`
- Rationale: The missing decision-sidecar requirement was the only blocker on these legacy adopted Architecture artifacts, and this bounded compatibility fallback restores them as canonical current heads without broadening into Runtime history or queue policy.
- Review result: `not_run`
- Review score: `n/a`
