# 2026-04-06 Discovery Front-Door Proof And Report Clarity Alignment

## Affected layer

- Discovery front-door routing record/report surfaces

## Owning lane

- Discovery lane consuming Engine-owned routing judgment

## Mission usefulness

- Make Discovery routing records self-describing instead of relying only on free-text rationale or the linked Engine run.
- Preserve current routing policy while making route confidence, review pressure, ambiguity, and explanation breakdown visible directly on Discovery artifacts and host views.

## Slice

- extended `DiscoveryMissionRoutingAssessment` with:
  - ambiguity summary
  - review guidance
  - structured explanation breakdown
- wrote the structured routing assessment into new Discovery routing records:
  - mission priority score
  - routing confidence
  - matched gap id/rank
  - route conflict
  - needs human review
  - ambiguity summary section
  - review guidance section
  - routing explanation breakdown section
- taught the Discovery routing reader to parse those sections compatibly while falling back to linked Engine run truth for older artifacts
- surfaced the new fields in the frontend Discovery routing detail
- extended Discovery routing and frontend-host checkers to prove the new structured report surface

## Proof path

- `npm run check:discovery-mission-routing`
- `npm run check:frontend-host`
- `npm run check`

## Rollback path

- revert `discovery/lib/discovery-mission-routing.ts`
- revert `discovery/lib/discovery-routing-record-writer.ts`
- revert `discovery/lib/discovery-front-door.ts`
- revert `discovery/lib/discovery-route-opener.ts`
- revert `hosts/web-host/data.ts`
- revert `frontend/src/app-types.ts`
- revert `frontend/src/app.ts`
- revert `scripts/check-discovery-mission-routing.ts`
- revert `scripts/check-frontend-host.ts`
- delete this log

## Stop summary

- stopped after aligning Discovery routing records, readers, and detail surfaces with the richer Engine explanation model
- did not change the routing decision policy itself or broaden into a larger Discovery workflow redesign
