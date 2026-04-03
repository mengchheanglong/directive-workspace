Cycle

Chosen task:

Advance the remaining live Runtime follow-up pending-review set through the bounded non-executing Runtime chain for:

- `dw-live-mini-swe-agent-engine-pressure-2026-03-24`
- `dw-live-scientify-engine-pressure-2026-03-24`

Why it won:

After the first Runtime review-open batch completed, current repo truth still showed two live Runtime cases with the same explicit next step and no integrity blockers:

- both cases were still at `runtime.follow_up.pending_review`
- both cases still had the same bounded next step: review the Runtime follow-up and approve one bounded Runtime record if justified
- both cases already fit the canonical non-executing Runtime opener chain

This made them the remaining highest-ROI live product work in the same class.

Affected layer:

Runtime bounded follow-up/proof/capability/promotion-readiness chain and the parity surfaces that prove those canonical openers.

Owning lane:

Architecture

Mission usefulness:

Directive Workspace now resolves the remaining live Runtime pressure cases through the same bounded non-executing Runtime chain already used by the proven canonical cases, which removes the last pending-review Runtime backlog with explicit approval-ready next steps.

Proof path:

1. Open the Runtime record for both pending-review cases through `openDirectiveRuntimeFollowUp(...)`.
2. Continue both cases through `openDirectiveRuntimeRecordProof(...)`, `openDirectiveRuntimeProofRuntimeCapabilityBoundary(...)`, and `openDirectiveRuntimePromotionReadiness(...)`.
3. Extend planner parity so the two cases now resolve to the parked promotion-readiness stop.
4. Extend follow-up, capability-boundary, and promotion-readiness projection parity coverage to the new cases.
5. Re-run targeted parity checks, canonical state reports, and the full repo check stack.

Rollback path:

Remove the newly materialized Runtime artifacts for the two cases, revert the parity-script updates, and remove this log.

Stop-line:

Stop once both cases reach `runtime.promotion_readiness.opened` with no automatic Runtime step open, the updated parity surfaces pass, and no equally strong remaining Runtime pending-review set is left.
