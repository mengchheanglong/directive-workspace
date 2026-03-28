# Discovery Queue Lifecycle Normalization Policy Boundary Engine-Routed Architecture Experiment

Date: 2026-03-28
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-pressure-engine-discovery-queue-lifecycle-normalization-policy-boundary-2026-03-28`
- Source reference: `discovery/intake-queue.json`
- Engine run record: `n/a`
- Engine run report: `n/a`
- Discovery routing record: `n/a`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: historical queue lifecycle ambiguity is now the remaining shared truth-policy seam. Raw queue `routed` still covers both live routed work and already-progressed cases, while the queue header still claims authoritative status tracking. The highest-value next move is an explicit policy boundary, not a broad rewrite.

## Objective

Open one bounded DEEP Architecture policy slice that decides how historical queue lifecycle semantics should be normalized in canonical truth.

## Bounded scope

- Keep this at one Architecture policy slice.
- Audit only the historical lifecycle/status semantics in `discovery/intake-queue.json` and the current interpretive read-model behavior around them.
- Record one explicit policy outcome.
- Do not mass-edit historical queue entries.
- Do not redesign queue lifecycle mechanics.
- Do not change queue-writer or resolver code in this session unless the policy result absolutely requires one tiny mechanical hook.
- Do not drift into unrelated Runtime, Discovery intake, frontend, or Architecture continuation work.

## Inputs

- Historical queue document: `discovery/intake-queue.json`
- Queue writer contract: `shared/lib/discovery-intake-queue-writer.ts`
- Queue transition contract: `shared/lib/discovery-intake-queue-transition.ts`
- Current read-model normalization surface: `hosts/web-host/data.ts`
- Canonical resolver: `shared/lib/dw-state.ts`

## Validation gate(s)

- `queue_lifecycle_policy_boundary_recorded`
- `no_mass_queue_rewrite`
- `workspace_checks_preserved`

## Lifecycle classification

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Rollback

Delete this DEEP policy case chain if a later product decision explicitly requires stored historical queue migration or a different queue source-of-truth boundary.

## Next decision

- `needs-more-evidence`
