# 2026-04-05 Engine Decision-State Policy Alignment

## Affected layer

- Engine decision policy

## Owning lane

- Engine core

## Mission usefulness

- Align preliminary Engine decisions with the richer routing truth already carried by confidence, ambiguity, and human-review signals.
- Make `needs_human_review` a real bounded decision state for non-Discovery routes that are directionally correct but still materially conflicted.

## Slice

- updated `buildDecision(...)` in `engine/directive-engine.ts` so non-Discovery candidates with `requiresHumanReview === true` now emit `needs_human_review` before falling through to Architecture or Runtime acceptance states
- extended `scripts/check-directive-engine-stage-chaining.ts` to prove the explicit review-required state for the ambiguous Architecture case
- corrected the replay expectations for the historical Architecture cases that still route to Architecture but remain conflicted and review-gated
- refreshed `shared/decision-states.md` so the directive-wide inventory still stays broad while the current Engine preliminary-decision subset now truthfully includes `needs_human_review`

## Proof path

- `npm run check:directive-engine-stage-chaining`
- `npm run check:directive-workspace-composition`
- `npm run check:control-authority`
- `npm run check`

## Rollback path

- revert `engine/directive-engine.ts`
- revert `scripts/check-directive-engine-stage-chaining.ts`
- revert `shared/decision-states.md`
- delete this log

## Stop summary

- stopped after the bounded decision-policy alignment slice
- did not broaden into Discovery front-door decision redesign, analytics changes, or aggregate reporting policy changes
