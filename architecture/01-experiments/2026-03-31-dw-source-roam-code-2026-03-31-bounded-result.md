# Roam-code Bounded Architecture Result

- Candidate id: dw-source-roam-code-2026-03-31
- Candidate name: Roam-code
- Experiment date: 2026-03-31
- Owning track: Architecture
- Experiment type: engine-routed bounded result
- Closeout approval: reviewed by codex-roam-phase-a-phase-3-pass from bounded start `architecture/01-experiments/2026-03-31-dw-source-roam-code-2026-03-31-bounded-start.md`

- Objective:
- Execute one bounded local-first Roam-code spike against the named Engine, `dw-state`, and control/check/report surfaces to determine whether Roam materially improves agent structural understanding over the current repo-native baseline.
- Bounded scope:
- Keep this at one Architecture execution slice.
- Limit evaluation to the named repo surfaces and the local isolated Roam install only.
- Do not begin permanent integration, repo-wide checks, services, MCP adoption, or renewed system comparison.
- Inputs:
- Phase A / Phase 2 already defined the exact repo surfaces, command surface, success criteria, failure criteria, rollback path, and allowed end states.
- The repo-native baseline for this slice was targeted file reads, `rg` structural inspection, directory inspection, and `npm run report:directive-workspace-state`.
- Roam was installed in an isolated local virtual environment at `.codex-roam-phase3` and indexed the repo into local `.roam/` state only.
- Expected output:
- One bounded Architecture result that honestly decides `adopt`, `park`, or `continue_one_more_bounded_slice`.
- Validation gate(s):
- `adaptation_complete`
- `improvement_complete`
- `engine_boundary_preserved`
- `decision_review`
- Transition policy profile: `decision_review`
- Scoring policy profile: `architecture_self_improvement`
- Blocked recovery path:
- If Roam cannot produce a materially stronger structural briefing than the repo-native baseline on the named surfaces, keep the case parked and preserve only the decision/result artifacts.
- Failure criteria:
- Roam's graph, context, or dependency outputs do not materially improve the defined repo-understanding questions over the current repo-native baseline.
- The install or index flow requires broad environment repair, persistent services, or repo-wide workflow changes.
- The only plausible next step becomes broad integration, broad tooling migration, or renewed comparison work.
- Rollback:
- Remove `.roam/` and `.codex-roam-phase3/` if the result is parked.
- Keep only the Discovery, Architecture, and control-log artifacts needed to preserve the bounded decision.
- Result summary:
- The bounded Roam-code spike was executed in an isolated local virtual environment rather than through broad repo integration. `roam index` completed and created only local `.roam/` state, so the local-first constraint held. However, the resulting graph-level output was materially weaker than the repo-native baseline for the target Engine/control/state surfaces. `roam understand` reported a 19-language, 10,948-file project with 46,654 symbols but `0 edges`, `0 clusters`, and no effective graph relationships. `roam map --budget 4000` repeated the same `0 edges` result and stated `No graph metrics available`. On the named facade/control surfaces, `roam file` did produce compact symbol listings with line ranges for `engine/state/index.ts`, `engine/directive-engine.ts`, `engine/routing.ts`, `engine/workspace-truth.ts`, `engine/approval-boundary.ts`, `scripts/report-directive-workspace-state.ts`, and `scripts/check-control-authority.ts`. However, the higher-value commands that were supposed to reduce blind rediscovery did not hold up on this repo. `roam context --for-file engine/state/index.ts` returned `0 caller files`, `0 callees`, and `0 test files`, and `roam deps engine/state/index.ts --full` returned `0 imports` and `0 importers` even though current repo truth and baseline file reads show that the file imports multiple shared helpers and is consumed across the product. Roam therefore did not provide a materially tighter single-pass structural briefing than the current repo-native path of targeted file reads, `rg`, directory inspection, and `npm run report:directive-workspace-state`. The bounded retained value is narrower: Roam can emit fast symbol skeletons locally, but on this workspace it failed to recover the dependency and caller graph that would justify immediate Architecture adoption or a follow-on slice. Because the local-first constraint held but the structural-insight delta did not, the honest decision is to park Phase A.
- Evidence path:
- Bounded start: `architecture/01-experiments/2026-03-31-dw-source-roam-code-2026-03-31-bounded-start.md`
- Handoff stub: `architecture/01-experiments/2026-03-31-dw-source-roam-code-2026-03-31-engine-handoff.md`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-31T00-00-00-000Z-dw-source-roam-code-2026-03-31-4d4f5f1b.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-31T00-00-00-000Z-dw-source-roam-code-2026-03-31-4d4f5f1b.md`
- Discovery routing record: `discovery/03-routing-log/2026-03-31-dw-source-roam-code-2026-03-31-phase-a-phase-2-routing-record.md`
- Closeout decision artifact: `architecture/01-experiments/2026-03-31-dw-source-roam-code-2026-03-31-bounded-result-adoption-decision.json`
- Phase log: `control/logs/2026-03/2026-03-31-roam-code-phase-a-phase-3.md`
- Next decision: `defer`

## Lifecycle classification (per `architecture-artifact-lifecycle` contract)

- Origin: `source-driven`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Source adaptation fields (Architecture source-driven experiments only)

- Source analysis ref: `architecture/01-experiments/2026-03-31-dw-source-roam-code-2026-03-31-engine-handoff.md`
- Adaptation decision ref: `n/a`
- Adaptation quality: `weak`
- Improvement quality: `weak`
- Meta-useful: `yes`
- Meta-usefulness category: `n/a`
- Transformation artifact gate result: `partial`
- Transformed artifacts produced:
- `architecture/01-experiments/2026-03-31-dw-source-roam-code-2026-03-31-bounded-result.md`

## Spike execution evidence

- Baseline:
- Targeted reads of `engine/approval-boundary.ts`, `engine/directive-engine.ts`, `engine/routing.ts`, `engine/workspace-truth.ts`, `engine/state/index.ts`, `scripts/report-directive-workspace-state.ts`, `scripts/check-control-authority.ts`, `control/runbook/active.md`, and `control/runbook/current-priority.md`
- Structural inspection via `rg`
- Repo-native state report via `npm run report:directive-workspace-state`
- Roam commands executed:
- `roam index`
- `roam understand`
- `roam map --budget 4000`
- `roam file engine/state/index.ts --full`
- `roam context --for-file engine/state/index.ts`
- `roam deps engine/state/index.ts --full`
- `roam file scripts/report-directive-workspace-state.ts --full`
- `roam file scripts/check-control-authority.ts --full`
- `roam file engine/directive-engine.ts --full`
- `roam file engine/routing.ts --full`
- `roam file engine/workspace-truth.ts --full`
- `roam file engine/approval-boundary.ts --full`
- Key observations:
- Local install and indexing succeeded without persistent services or repo-wide integration.
- File-level symbol skeletons were serviceable.
- Graph, caller, callee, importer, and dependency outputs were effectively absent on the named surfaces.

## Closeout decision

- Verdict: `stay_experimental`
- Rationale: The local-first Roam spike succeeded operationally but did not materially improve structural understanding over the repo-native baseline on the target Engine/control/state surfaces, so no immediate adoption or continuation is justified.
- Review result: `approved`
- Review score: `4`

