# Engine Legacy Architecture Adoption Compatibility Engine-Routed Architecture Experiment

Date: 2026-03-28
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-pressure-engine-legacy-architecture-adoption-compatibility-2026-03-28`
- Source reference: `architecture/lib/architecture-result-adoption.ts`
- Engine run record: n/a
- Engine run report: n/a
- Discovery routing record: n/a
- Legacy adopted artifact set:
  - `architecture/02-adopted/2026-03-22-openclaw-runtime-verification-freshness-adopted.md`
  - `architecture/02-adopted/2026-03-22-openclaw-maintenance-watchdog-signal-lane-adopted.md`
  - `architecture/02-adopted/2026-03-22-openclaw-discovery-submission-flow-adopted.md`
  - `architecture/02-adopted/2026-03-22-discovery-gap-priority-worklist-adopted.md`
- Primary truth surface: `engine/state/index.ts`
- Composition checker: `scripts/check-directive-workspace-composition.ts`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: the shared resolver now handles the remaining current-era monitor and route seams, but these older adopted Architecture artifacts still fail canonical focus because the adoption reader hard-requires modern decision JSON that those legacy records never had.

## Objective

Open one bounded DEEP Architecture slice that makes legacy `architecture/02-adopted/*.md` artifacts canonical current heads without requiring modern adoption decision JSON.

## Bounded scope

- Keep this at one shared Engine/truth-quality slice.
- Limit the code change to `architecture/lib/architecture-result-adoption.ts`.
- Add targeted resolver coverage in `scripts/check-directive-workspace-composition.ts`.
- Parse candidate identity and final-status fallback directly from the legacy adopted markdown when decision JSON is missing.
- Keep queue lifecycle policy, Runtime history support, and generic historical normalization out of scope.

## Inputs

- `readDirectiveArchitectureAdoptionDetail(...)` currently hard-requires `*-adoption-decision.json`.
- The legacy adopted artifacts above all resolve as direct Architecture adoptions in practice, but they are older than the modern decision sidecar format.
- `readArchitectureUpstreamChainFromAdoption(...)` already tolerates empty source-result linkage, so the missing decision sidecar is the concrete blocker.

## Validation gate(s)

- `legacy_architecture_adoption_compatibility_complete`
- `legacy_architecture_adoption_scope_preserved`
- `decision_review`

## Lifecycle classification

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Rollback

Revert the legacy adoption fallback in `architecture/lib/architecture-result-adoption.ts`, revert the checker coverage, and delete this DEEP case chain.

## Next decision

- `adopt`

