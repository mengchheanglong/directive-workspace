# Roam-code Bounded Architecture Start

- Candidate id: dw-source-roam-code-2026-03-31
- Candidate name: Roam-code
- Experiment date: 2026-03-31
- Owning track: Architecture
- Experiment type: engine-routed bounded start
- Start approval: approved by codex-phase-a-phase-2-pass from routed handoff `architecture/01-experiments/2026-03-31-dw-source-roam-code-2026-03-31-engine-handoff.md`

- Objective: Define one bounded local-first Roam-code spike packet that can be executed in a later Phase A / Phase 3 thread to test whether Roam materially improves agent understanding of current Directive Workspace structure versus the existing repo-native truth surfaces, without opening adoption, runtime rollout, or broad tool comparison.
- Bounded scope:
- Keep this at one Architecture planning slice that prepares, but does not execute, the future Roam-code spike.
- Limit the future spike target to current Engine structure, `dw-state`, control/check/report surfaces, and repeated agent rediscovery pressure.
- Do not install, run, integrate, or adopt Roam-code from this bounded start.
- Inputs:
- Current repo pressure centers on `engine/`, `shared/lib/dw-state.ts`, `scripts/report-directive-workspace-state.ts`, `scripts/check-control-authority.ts`, and the active `control/runbook/` surfaces.
- Phase A / Phase 1 preserved the source in Discovery and parked it cleanly until this authorized Architecture promotion.
- Official Roam-code command surface needed for the future spike is bounded to local install/index/briefing/context commands such as `uv tool install roam-code`, `roam init`, `roam understand`, `roam map`, `roam file`, `roam context`, and `roam deps`.
- Expected output:
- One executable Phase A / Phase 3 spike packet with exact repo surfaces, exact future commands, exact comparison criteria, explicit proof criteria, rollback, stop-line, and allowed end states.
- One bounded Architecture experiment slice that can proceed later without reopening Discovery source triage or broadening into tool adoption.
- Validation gate(s):
- `adaptation_complete`
- `improvement_complete`
- `engine_boundary_preserved`
- `decision_review`
- Transition policy profile: `decision_review`
- Scoring policy profile: `architecture_self_improvement`
- Blocked recovery path: Leave the routed handoff and this bounded start as the authoritative planning packet and stop before any Roam-code execution if the spike scope stops being honest.
- Failure criteria: The future spike cannot be kept local-first and bounded, or it cannot define a clearer comparison target than the current repo-native path of `npm run report:directive-workspace-state` plus targeted file reads.
- Rollback: Remove only the Roam-code Architecture planning artifacts and return the source to a parked state if the future spike proves unjustified.
- Result summary: pending_execution
- Evidence path:
- Handoff stub: `architecture/01-experiments/2026-03-31-dw-source-roam-code-2026-03-31-engine-handoff.md`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-31T00-00-00-000Z-dw-source-roam-code-2026-03-31-4d4f5f1b.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-31T00-00-00-000Z-dw-source-roam-code-2026-03-31-4d4f5f1b.md`
- Discovery routing record: `discovery/03-routing-log/2026-03-31-dw-source-roam-code-2026-03-31-phase-a-phase-2-routing-record.md`
- Next decision: `needs-more-evidence`

## Lifecycle classification (per `architecture-artifact-lifecycle` contract)

- Origin: `source-driven`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Source adaptation fields (Architecture source-driven experiments only)

- Source analysis ref: architecture/01-experiments/2026-03-31-dw-source-roam-code-2026-03-31-engine-handoff.md
- Adaptation decision ref: n/a
- Adaptation quality: `skipped`
- Improvement quality: `skipped`
- Meta-useful: `yes`
- Meta-usefulness category: `n/a`
- Transformation artifact gate result: `partial`
- Transformed artifacts produced: `architecture/01-experiments/2026-03-31-dw-source-roam-code-2026-03-31-engine-handoff.md`

## Phase A / Phase 3 Spike Packet

- Repo surfaces to test:
- `engine/approval-boundary.ts`
- `engine/directive-engine.ts`
- `engine/routing.ts`
- `engine/workspace-truth.ts`
- `shared/lib/dw-state.ts`
- `scripts/report-directive-workspace-state.ts`
- `scripts/check-control-authority.ts`
- `control/runbook/active.md`
- `control/runbook/current-priority.md`
- Future commands or actions:
- Create an isolated local install using `uv tool install roam-code` or `pipx install roam-code`.
- From the repo root, run `roam init` to build the local index and create Roam's local metadata only.
- Run `roam understand` and `roam map --budget 4000` to capture the repo-level briefing and structural map.
- Run `roam file shared/lib/dw-state.ts --full`, `roam context --for-file shared/lib/dw-state.ts`, and `roam deps shared/lib/dw-state.ts --full` to evaluate facade/truth-surface handling.
- Run `roam file scripts/report-directive-workspace-state.ts --full` and `roam file scripts/check-control-authority.ts --full` to evaluate control/report surface handling.
- Run `roam file engine/directive-engine.ts --full` and `roam file engine/routing.ts --full` to evaluate Engine lane/structure handling.
- Success criteria:
- Roam installs and indexes locally without requiring broad repo mutation beyond its own local `.roam/` artifacts.
- Roam produces a materially tighter single-pass structural briefing for the listed surfaces than the current baseline of targeted file reads plus `npm run report:directive-workspace-state`.
- The spike yields a bounded Architecture result that can clearly say `adopt`, `park`, or `continue_one_more_bounded_slice` without reopening broad comparison work.
- Failure or non-adoption criteria:
- The install or index flow requires broad environment repair, persistent runtime services, or repo-wide workflow changes.
- Roam's outputs do not materially improve the defined repo-understanding questions over the current repo-native baseline.
- The only plausible next step becomes broad integration, broad tooling migration, or renewed multi-system comparison.
- Rollback path:
- Uninstall the isolated Roam tool.
- Remove any `.roam/` artifacts created by the future spike.
- Keep only the Discovery and Architecture planning records if the spike is parked.
- Stop-line:
- Stop after one bounded Phase A / Phase 3 result and decision closeout.
- Do not begin permanent integration, background daemons, MCP adoption, Backstage reopening, or Temporal reopening from the first Roam execution slice.
- Allowed end states:
- `adopt`
- `park`
- `continue_one_more_bounded_slice`


