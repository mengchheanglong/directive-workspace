# Adopted Planned Next: Engine Discovery Required-Next-Artifact Legality Hardening (2026-03-28)

## adopted
- Candidate id: `dw-pressure-engine-discovery-required-next-artifact-legality-hardening-2026-03-28`
- Candidate name: Engine Discovery Required-Next-Artifact Legality Hardening
- Source bounded result artifact: `architecture/01-experiments/2026-03-28-dw-pressure-engine-discovery-required-next-artifact-legality-hardening-2026-03-28-bounded-result.md`
- Source decision artifact: `architecture/01-experiments/2026-03-28-dw-pressure-engine-discovery-required-next-artifact-legality-hardening-2026-03-28-bounded-result-adoption-decision.json`
- Usefulness level: `meta`
- Final adoption status: `adopt_planned_next`
- Adoption approval: `directive-lead-review`

## retained result
- Result summary retained: Discovery route legality now blocks the false-positive case where a concrete required next artifact is absent and no downstream stub exists to satisfy the claimed next step.

## next materialization
- Implementation target artifact: `architecture/04-implementation-targets/2026-03-28-dw-pressure-engine-discovery-required-next-artifact-legality-hardening-2026-03-28-implementation-target.md`
- Implementation intent: `shared-lib`

## limits
- Do not broaden into generic missing-artifact blocking.
- Do not broaden into stale-status repair, queue redesign, or broken-link scanning.

