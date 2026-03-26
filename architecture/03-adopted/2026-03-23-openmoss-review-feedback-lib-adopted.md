# Adopted: OpenMOSS Review Feedback Lib

- Adopted date: `2026-03-23`
- Owning track: `Architecture`
- Status: `product_materialized`
- Origin: `source-driven`
- Usefulness level: `meta`
- Source id: `dw-src-openmoss-review-feedback-lib`

## Problem

Directive Workspace had already extracted OpenMOSS's lifecycle transition and score-feedback behavior into product-owned contracts.

But that value still existed mostly as policy.
There was no canonical shared-lib surface implementing:
- lifecycle transition validity
- role-gated checks
- deterministic review-score deltas
- blocked recovery planning
- review outcome resolution

That left the system vulnerable to repeating the same drift:
- good contracts
- but manual or host-local reimplementation of the actual behavior

## Source

- Primary source:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\OpenMOSS\app\services\review_service.py`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\OpenMOSS\app\services\reward_service.py`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\OpenMOSS\app\services\sub_task_service.py`
- Prior Directive context:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\lifecycle-transition-policy.md`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\experiment-score-feedback.md`

## What was extracted

1. deterministic lifecycle transition matrix
2. role-gated transition validation
3. deterministic review-score delta mapping
4. blocked recovery plan builder
5. review outcome resolver for next-state recommendation

## What was excluded as baggage

- SQLAlchemy transaction wiring
- database models and tables
- FastAPI routing
- OpenMOSS UI and leaderboard behavior

## Materialized artifacts

1. Canonical shared lib:
   - `shared/lib/lifecycle-review-feedback.ts`
2. Mission Control host mirror:
   - `mission-control/src/lib/directive-workspace/lifecycle-review-feedback.ts`
3. Source analysis:
   - `architecture/02-experiments/2026-03-23-openmoss-review-feedback-lib-source-analysis.md`
4. Adaptation decision:
   - `architecture/02-experiments/2026-03-23-openmoss-review-feedback-lib-adaptation.md`

## Why adopted

This is the code-level Architecture extraction that the earlier OpenMOSS work was still missing.

It does not adopt the OpenMOSS runtime.
It operationalizes the already-proven useful mechanism as product-owned code.

That improves Directive Workspace more directly than another contract-only slice because the system can now call one canonical helper instead of re-deriving the same behavior from Markdown.

## Adoption criteria summary

- source analysis complete: yes
- adaptation decision complete: yes
- adaptation quality acceptable: yes (`strong`)
- delta evidence present: yes
- no unresolved baggage: yes

Artifact type selection:
- shared lib for executable product-owned behavior

Runtime threshold check:
- no Runtime handoff
- the mechanism is valuable even if no runtime surface is promoted

## Self-improvement evidence

- Category: `evaluation_quality`
- Claim: Future Directive review and lifecycle loops will become cleaner and less drift-prone because lifecycle transition rules, score feedback, and blocked recovery behavior now exist as one canonical executable helper instead of only policy text.
- Mechanism: `shared/lib/lifecycle-review-feedback.ts` plus the Mission Control mirror operationalize the already-adopted OpenMOSS patterns into reusable code.
- Baseline observation: Directive Workspace had lifecycle and score-feedback contracts but no product-owned helper implementing those rules.
- Expected effect: future review-oriented product work can import one canonical helper instead of recreating transition or score logic locally.
- Verification method: `structural_inspection`

## Rollback

- remove `shared/lib/lifecycle-review-feedback.ts`
- remove `mission-control/src/lib/directive-workspace/lifecycle-review-feedback.ts`
- revert boundary inventory and shared-lib README updates
- remove the source analysis and adaptation records
