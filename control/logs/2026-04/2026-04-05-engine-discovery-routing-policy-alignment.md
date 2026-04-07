# 2026-04-05 Engine Discovery Routing Policy Alignment

## Affected layer

- Engine routing policy
- Discovery front-door routing policy

## Owning lane

- Engine core
- Discovery front door

## Mission usefulness

- keep strong Runtime and Architecture routes truthful even when no open gap matches
- reduce drift between Engine routing and Discovery mission-routing shape/review policy
- add direct proof coverage for the Discovery-side route-shape seam

## Slice

- extended Engine routing so high-confidence, non-conflicted Runtime routes can still return `fast_path` without an open gap when strong Runtime signals are explicit
- aligned Engine `needsHumanReview` so high-confidence bounded no-gap routes are not forced into extra review only because `matchedGap` is null
- aligned Discovery mission-routing shape/review policy with the same bounded no-gap Runtime and Architecture behavior
- fixed a stale duplicated runtime-signal local in `discovery-mission-routing.ts` while touching that policy surface
- added a dedicated `check:discovery-mission-routing` checker and wired it into the foundation batch
- audited queue-only adapter defaults in thin host/import adapter entry surfaces and left them unchanged because they remain truthful bounded defaults

## Proof path

- `npm run check:directive-engine-stage-chaining`
- `npm run check:discovery-mission-routing`
- `npm run check:directive-workspace-composition`
- `npm run check`

## Rollback path

- revert `engine/routing.ts`
- revert `discovery/lib/discovery-mission-routing.ts`
- revert `scripts/check-directive-engine-stage-chaining.ts`
- revert `scripts/check-discovery-mission-routing.ts`
- revert `package.json`
- revert `scripts/check-batches.ts`

## Stop summary

- stopped after the bounded Engine/Discovery routing-policy alignment slice
- did not redesign the full Discovery front door or widen adapter defaults beyond audited truth
