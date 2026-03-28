# Legacy Runtime Narrative Followup Compatibility Bounded Architecture Result

- Candidate id: dw-pressure-engine-legacy-runtime-narrative-followup-compat-2026-03-28
- Candidate name: Legacy Runtime Narrative Followup Compatibility
- Experiment date: 2026-03-28
- Owning track: Architecture
- Experiment type: engine-routed bounded result
- Closeout approval: not explicitly recorded in the compact bounded result artifact; reconstructed from bounded start `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-narrative-followup-compat-2026-03-28-bounded-start.md`

- Objective: Open one bounded DEEP Architecture slice that makes the canonical resolver and workbench follow-up detail treat the remaining narrative historical Runtime follow-ups as read-only Runtime state instead of crashing or surfacing invalid state.
- Bounded scope:
- Keep this at one shared Engine / truth-quality slice.
- Limit the change to `shared/lib/dw-state.ts`, `hosts/web-host/data.ts`, and focused repo checks.
- Support these three narrative historical Runtime follow-ups only:
- `runtime/follow-up/2026-03-20-agent-orchestrator-runtime-followup.md`
- `runtime/follow-up/2026-03-20-promptfoo-runtime-followup.md`
- `runtime/follow-up/2026-03-20-puppeteer-browser-runtime-followup.md`
- Keep them historical and read-only.
- Do not map legacy Runtime records, legacy Runtime execution chains, or old promotion / registry semantics.
- Inputs:
- `resolveDirectiveWorkspaceState(...)` still crashes on the remaining narrative `*-runtime-followup.md` artifacts because the shared legacy follow-up reader only understands the more structured bullet-contract shape.
- `readDirectiveWorkbenchHandoffDetail(...)` still surfaces those same narrative follow-ups as invalid because the workbench detail fallback does not yet support their historical section-based shape.
- Expected output:
- One bounded Architecture experiment slice that resolves the remaining narrative historical Runtime follow-ups cleanly through the canonical report and workbench host check.
- Validation gate(s):
- `legacy_runtime_narrative_follow_up_focus_resolves`
- `legacy_runtime_narrative_follow_up_scope_preserved`
- `engine_boundary_preserved`
- Transition policy profile: `decision_review`
- Scoring policy profile: `architecture_self_improvement`
- Blocked recovery path: Leave the artifacts historical and read-only, and stop before any Runtime continuation or normalization of broader legacy history.
- Failure criteria: The resolver or workbench detail still crashes on the narrative legacy follow-up family, or the slice starts inventing promotion / execution semantics for historical Runtime artifacts.
- Rollback: Revert the legacy narrative Runtime follow-up compatibility slice, revert focused repo checks, and delete this DEEP case chain.
- Result summary: Canonical Runtime truth and workbench follow-up detail now resolve the remaining narrative historical Runtime follow-ups as read-only Runtime state instead of crashing or surfacing invalid state.
- Evidence path:
- Primary evidence path: `shared/lib/dw-state.ts`
- Bounded start: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-narrative-followup-compat-2026-03-28-bounded-start.md`
- Handoff stub: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-narrative-followup-compat-2026-03-28-engine-handoff.md`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-27T00-00-00-000Z-dw-source-ts-edge-2026-03-27-0aacdf59.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-27T00-00-00-000Z-dw-source-ts-edge-2026-03-27-0aacdf59.md`
- Discovery routing record: `discovery/routing-log/2026-03-27-dw-source-ts-edge-2026-03-27-routing-record.md`
- Closeout decision artifact: `architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-narrative-followup-compat-2026-03-28-bounded-result-adoption-decision.json`
- Next decision: `adopt`

## Lifecycle classification (per `architecture-artifact-lifecycle` contract)

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Source adaptation fields

- Source analysis ref: architecture/02-experiments/2026-03-28-dw-pressure-engine-legacy-runtime-narrative-followup-compat-2026-03-28-engine-handoff.md
- Adaptation decision ref: n/a
- Adaptation quality: `skipped`
- Improvement quality: `skipped`
- Meta-useful: `yes`
- Meta-usefulness category: `n/a`
- Transformation artifact gate result: `partial`
- Transformed artifacts produced:
- `shared/lib/dw-state.ts`
- `hosts/web-host/data.ts`
- `scripts/check-directive-workspace-composition.ts`
- `scripts/check-frontend-host.ts`

## Closeout decision

- Verdict: `adopt`
- Rationale: This is a bounded shared-truth compatibility fix that removes the remaining direct report and workbench invalid-state failures for the narrative legacy Runtime follow-up family without widening old Runtime execution, promotion, or registry semantics.
- Review result: `not_run`
- Review score: `n/a`
