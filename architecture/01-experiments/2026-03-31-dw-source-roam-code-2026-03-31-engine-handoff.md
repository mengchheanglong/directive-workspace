# Roam-code Engine-Routed Architecture Experiment

Date: 2026-03-31
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-source-roam-code-2026-03-31`
- Source reference: `sources/intake/source-roam-code.md`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-31T00-00-00-000Z-dw-source-roam-code-2026-03-31-4d4f5f1b.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-31T00-00-00-000Z-dw-source-roam-code-2026-03-31-4d4f5f1b.md`
- Discovery routing record: `discovery/03-routing-log/2026-03-31-dw-source-roam-code-2026-03-31-phase-a-phase-2-routing-record.md`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: the source may improve how Directive Workspace agents understand repo structure, lane boundaries, and control surfaces before they open downstream work.

## Objective

Define one bounded local-first Roam-code spike packet that can be executed in a later Phase A / Phase 3 thread to test whether Roam materially improves agent understanding of current Directive Workspace structure versus the existing repo-native truth surfaces, without opening adoption, runtime rollout, or broad tool comparison.

## Bounded scope

- Keep this at one Architecture planning slice that prepares, but does not execute, the future Roam-code spike.
- Limit the future spike target to current Engine structure, `dw-state`, control/check/report surfaces, and repeated agent rediscovery pressure.
- Do not install, run, integrate, or adopt Roam-code from this handoff alone.

## Inputs

- Current repo pressure centers on `engine/`, `shared/lib/dw-state.ts`, `scripts/report-directive-workspace-state.ts`, `scripts/check-control-authority.ts`, and the active `control/runbook/` surfaces.
- Phase A / Phase 1 already preserved the official source and parked it cleanly in Discovery monitor until this authorized Phase A / Phase 2 promotion.
- Official Roam-code command surface needed for the future spike is bounded to local install/index/briefing/context commands such as `uv tool install roam-code`, `roam init`, `roam understand`, `roam map`, `roam file`, `roam context`, and `roam deps`.

## Validation gate(s)

- `adaptation_complete`
- `improvement_complete`
- `engine_boundary_preserved`
- `decision_review`

## Lifecycle classification

- Origin: `source-driven`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Rollback

Keep the result at experiment status and remove only the Roam-code-specific Architecture planning artifacts if the future spike cannot be scoped honestly or if it drifts toward broader adoption.

## Next decision

- `needs-more-evidence`

