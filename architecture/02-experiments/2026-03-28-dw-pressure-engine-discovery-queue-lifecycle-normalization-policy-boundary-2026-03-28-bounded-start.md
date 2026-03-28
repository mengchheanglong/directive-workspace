# Discovery Queue Lifecycle Normalization Policy Boundary Bounded Architecture Start

- Candidate id: dw-pressure-engine-discovery-queue-lifecycle-normalization-policy-boundary-2026-03-28
- Candidate name: Discovery Queue Lifecycle Normalization Policy Boundary
- Experiment date: 2026-03-28
- Owning track: Architecture
- Experiment type: engine-routed bounded start
- Start approval: approved by directive-lead-implementer from routed handoff `architecture/02-experiments/2026-03-28-dw-pressure-engine-discovery-queue-lifecycle-normalization-policy-boundary-2026-03-28-engine-handoff.md`

- Objective: Decide how historical queue lifecycle semantics should be normalized in canonical truth, without treating broad queue rewrite as the default.
- Bounded scope:
- Keep this at one Architecture policy slice.
- Audit only historical queue lifecycle semantics in `discovery/intake-queue.json` and the current interpretive read-model around them.
- Record one explicit policy outcome.
- Do not mass-edit historical queue entries.
- Do not redesign queue lifecycle mechanics or writer flow.
- Do not change shared code in this session unless the decision absolutely requires one tiny mechanical hook.
- Inputs:
- Queue schema still allows `pending`, `processing`, `routed`, `completed`, and `held`.
- The stored historical queue currently contains only `routed` and `completed`.
- Current read-model logic already derives `routed_progressed` when canonical truth shows the live case head moved downstream.
- Expected output:
- One bounded Architecture policy result that makes the historical queue normalization boundary explicit without widening into migration work.
- Validation gate(s):
- `queue_lifecycle_policy_boundary_recorded`
- `no_mass_queue_rewrite`
- `workspace_checks_preserved`
- Transition policy profile: `decision_review`
- Scoring policy profile: `architecture_self_improvement`
- Blocked recovery path: Keep raw queue lifecycle values as historical evidence and rely on interpretive canonical/read-model normalization instead of rewriting stored history.
- Failure criteria: The policy slice invents broad new lifecycle semantics, claims mass migration is required without stronger product pressure, or blurs queue evidence with live current-head truth.
- Rollback: Delete this DEEP policy case chain if a later product decision explicitly requires stored historical queue migration or a different queue source-of-truth boundary.
- Result summary: pending_execution
- Evidence path:
- Handoff stub: `architecture/02-experiments/2026-03-28-dw-pressure-engine-discovery-queue-lifecycle-normalization-policy-boundary-2026-03-28-engine-handoff.md`
- Engine run record: `n/a`
- Engine run report: `n/a`
- Discovery routing record: `n/a`
- Next decision: `needs-more-evidence`

## Lifecycle classification (per `architecture-artifact-lifecycle` contract)

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Source adaptation fields

- Source analysis ref: architecture/02-experiments/2026-03-28-dw-pressure-engine-discovery-queue-lifecycle-normalization-policy-boundary-2026-03-28-engine-handoff.md
- Adaptation decision ref: n/a
- Adaptation quality: `skipped`
- Improvement quality: `skipped`
- Meta-useful: `yes`
- Meta-usefulness category: `n/a`
- Transformation artifact gate result: `partial`
- Transformed artifacts produced: `architecture/02-experiments/2026-03-28-dw-pressure-engine-discovery-queue-lifecycle-normalization-policy-boundary-2026-03-28-engine-handoff.md`
