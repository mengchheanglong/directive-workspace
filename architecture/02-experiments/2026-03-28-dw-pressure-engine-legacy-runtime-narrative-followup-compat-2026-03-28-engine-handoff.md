# Legacy Runtime Narrative Followup Compatibility Engine-Routed Architecture Experiment

Date: 2026-03-28
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-pressure-engine-legacy-runtime-narrative-followup-compat-2026-03-28`
- Source reference: `runtime/follow-up/2026-03-20-agent-orchestrator-runtime-followup.md`
- Engine run record: `n/a`
- Engine run report: `n/a`
- Discovery routing record: `n/a`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: the remaining narrative `*-runtime-followup.md` artifacts are still part of product Runtime history, but the canonical resolver and workbench detail cannot inspect them directly yet.

## Objective

Open one bounded DEEP Architecture slice that makes the canonical resolver and workbench follow-up detail treat the remaining narrative historical Runtime follow-ups as read-only Runtime state instead of crashing or surfacing invalid state.

## Bounded scope

- Keep this at one Architecture experiment slice.
- Restrict the code change to `shared/lib/dw-state.ts`, `hosts/web-host/data.ts`, and focused repo checks.
- Support these three narrative historical Runtime follow-ups only:
  - `runtime/follow-up/2026-03-20-agent-orchestrator-runtime-followup.md`
  - `runtime/follow-up/2026-03-20-promptfoo-runtime-followup.md`
  - `runtime/follow-up/2026-03-20-puppeteer-browser-runtime-followup.md`
- Keep them historical and read-only.
- Do not map legacy Runtime records, legacy Runtime execution chains, or old promotion / registry semantics in this slice.

## Inputs

- Legacy Runtime follow-up: `runtime/follow-up/2026-03-20-agent-orchestrator-runtime-followup.md`
- Legacy Runtime follow-up: `runtime/follow-up/2026-03-20-promptfoo-runtime-followup.md`
- Legacy Runtime follow-up: `runtime/follow-up/2026-03-20-puppeteer-browser-runtime-followup.md`
- Current canonical state reader: `shared/lib/dw-state.ts`
- Current workbench handoff detail fallback: `hosts/web-host/data.ts`
- Current whole-product composition check: `scripts/check-directive-workspace-composition.ts`
- Current frontend host check: `scripts/check-frontend-host.ts`

## Validation gate(s)

- `legacy_runtime_narrative_follow_up_focus_resolves`
- `legacy_runtime_narrative_follow_up_scope_preserved`
- `engine_boundary_preserved`

## Lifecycle classification

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Rollback

Revert the legacy narrative Runtime follow-up compatibility slice and delete this DEEP case chain if the resolver or workbench detail starts overstating old Runtime continuation state.

## Next decision

- `adopt`
