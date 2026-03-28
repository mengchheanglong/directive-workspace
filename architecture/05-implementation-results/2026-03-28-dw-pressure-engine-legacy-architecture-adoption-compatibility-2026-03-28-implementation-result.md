# Implementation Result: Engine Legacy Architecture Adoption Compatibility (2026-03-28)

## target closure
- Candidate id: `dw-pressure-engine-legacy-architecture-adoption-compatibility-2026-03-28`
- Candidate name: Engine Legacy Architecture Adoption Compatibility
- Source implementation target: `architecture/04-implementation-targets/2026-03-28-dw-pressure-engine-legacy-architecture-adoption-compatibility-2026-03-28-implementation-target.md`
- Source adoption artifact: `architecture/03-adopted/2026-03-28-dw-pressure-engine-legacy-architecture-adoption-compatibility-2026-03-28-adopted-planned-next.md`
- Source bounded result artifact: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-architecture-adoption-compatibility-2026-03-28-bounded-result.md`
- Usefulness level: `meta`
- Completion approval: `directive-lead-implementer`

## objective
- Objective retained: add one bounded compatibility fallback so the four legacy `architecture/03-adopted` artifacts resolve as canonical current heads without requiring modern decision sidecars.

## completed tactical slice
- Added a fallback path in `shared/lib/architecture-result-adoption.ts` when the adoption decision sidecar is missing.
- Parsed candidate identity and final-status fallback directly from the legacy adopted markdown.
- Preserved the modern reader path when a decision JSON exists.
- Added composition coverage in `scripts/check-directive-workspace-composition.ts` for all four legacy adopted artifacts.

## actual result summary
- Canonical Architecture truth now keeps the legacy adopted records reachable as clean adopted current heads instead of treating them as broken historical drift.

## mechanical success criteria check
- All four legacy adopted artifacts now resolve with `integrityState = ok`.
- All four now resolve with `currentStage = architecture.adoption.adopted`.
- All four expose only the expected implementation-target gap.
- `npm run check:directive-workspace-composition` passed.
- `npm run report:directive-workspace-state -- architecture/03-adopted/2026-03-22-openclaw-discovery-submission-flow-adopted.md` passed.

## explicit limitations carried forward
- This slice does not add Runtime history support.
- This slice does not rewrite queue lifecycle semantics.
- It does not broaden into generic historical normalization.

## completion decision
- Outcome: `success`
- Validation result: All validation gates passed: legacy_architecture_adoption_compatibility_complete, legacy_architecture_adoption_scope_preserved, decision_review, composition_check_ok.

## evidence
- `shared/lib/architecture-result-adoption.ts`
- `scripts/check-directive-workspace-composition.ts`
- `npm run check:directive-workspace-composition`
- `npm run report:directive-workspace-state -- architecture/03-adopted/2026-03-22-openclaw-discovery-submission-flow-adopted.md`

## rollback note
- Revert the legacy adoption fallback, revert the checker coverage, and remove this DEEP case chain if later Architecture truth needs a different legacy-compatibility contract.
