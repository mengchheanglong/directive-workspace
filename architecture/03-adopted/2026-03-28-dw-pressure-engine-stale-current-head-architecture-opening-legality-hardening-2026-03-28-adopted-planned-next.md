# Adopted Planned Next: Engine Stale Current-Head Architecture Opening Legality Hardening (2026-03-28)

- Final status: `adopt_planned_next`.

## adoption
- Candidate id: `dw-pressure-engine-stale-current-head-architecture-opening-legality-hardening-2026-03-28`
- Candidate name: Engine Stale Current-Head Architecture Opening Legality Hardening
- Source bounded result: `architecture/02-experiments/2026-03-28-dw-pressure-engine-stale-current-head-architecture-opening-legality-hardening-2026-03-28-bounded-result.md`
- Adoption decision: `architecture/02-experiments/2026-03-28-dw-pressure-engine-stale-current-head-architecture-opening-legality-hardening-2026-03-28-bounded-result-adoption-decision.json`
- Usefulness level: `meta`
- Artifact type: `shared-lib`
- Status: `adopt_planned_next`

## adopted value
- Downgrade stale artifact-local next-step wording on historical Architecture handoff and bounded-start artifacts once `currentHead` has already advanced elsewhere.

## planned next
- Materialize the bounded shared-lib change in `shared/lib/dw-state/shared.ts`.
- Add composition coverage for stale Architecture handoff and bounded-start focuses.
- Stop after verification.

## rollback
- Revert the shared-lib change, revert the checker coverage, and remove this DEEP case chain if later Architecture policy changes the meaning of stale opening-surface next steps.
