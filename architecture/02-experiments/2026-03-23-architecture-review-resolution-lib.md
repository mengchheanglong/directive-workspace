# Architecture Review Resolution Lib

- Date: `2026-03-23`
- Track: `architecture`
- Origin: `internally-generated`
- Usefulness level: `meta`
- Forge threshold check: `yes` - the retained value improves Directive Workspace's Architecture review lane without requiring a runtime surface

## Why this slice exists

Directive Workspace already had:
- review guardrails in `shared/contracts/architecture-review-guardrails.md`
- review checklist structure in `shared/templates/architecture-review-checklist.md`
- executable lifecycle/review feedback in `shared/lib/lifecycle-review-feedback.ts`

But the Architecture review lane still lacked executable resolution logic for:
- turning review guardrail results into a deterministic review score
- deciding approved vs rejected review result
- mapping review result into `decided`, `experimenting`, or `blocked`
- emitting required changes instead of leaving that work inside checklist prose

## Experiment move

Materialize a canonical shared lib:
- `shared/lib/architecture-review-resolution.ts`

Mirror it in Mission Control:
- `mission-control/src/lib/directive-workspace/architecture-review-resolution.ts`

Then bind the executable lane to the existing Impeccable review check:
- `mission-control/scripts/check-directive-impeccable-contracts.ts`

## Expected result

Architecture review becomes:
- executable
- deterministic
- lifecycle-aware
- able to produce strong-pass, follow-up, resume, and blocked-recovery outcomes from one canonical product-owned code path
