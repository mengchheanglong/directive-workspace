# 2026-04-05 Engine Gap-Pressure Visibility Surface Alignment

## Affected layer

- Engine reporting and host/operator read surfaces

## Owning lane

- Engine core with Discovery front-door pressure

## Mission usefulness

- Make gap-backed routing pressure inspectable to operators instead of exposing only a matched gap ID.
- Keep Discovery-first review readable when routing confidence, ambiguity, and open-gap pressure all matter together.

## Slice

- expanded `shared/lib/engine-run-artifacts.ts` with a stable `gapPressure` read shape derived from persisted Engine runs
- threaded the same `gapPressure` surface through `discovery/lib/discovery-route-opener.ts` so Discovery routing detail can expose the matched gap description, rank, priority, and gap-alignment score
- widened the standalone Engine run markdown report in `hosts/standalone-host/runtime.ts` to render a dedicated `Gap Pressure` section
- exposed the new gap-pressure fields in the frontend types and UI tables for Engine run detail and Discovery routing detail
- updated the frontend host checker fixture to seed a real matched gap and prove the new visibility surface renders

## Proof path

- `npm run check:directive-engine-stage-chaining`
- `npm run check:frontend-host`
- `npm run check:directive-workspace-composition`
- `npm run check`

## Rollback path

- revert `shared/lib/engine-run-artifacts.ts`
- revert `discovery/lib/discovery-route-opener.ts`
- revert `hosts/standalone-host/runtime.ts`
- revert `hosts/web-host/data.ts`
- revert `frontend/src/app-types.ts`
- revert `frontend/src/app.ts`
- revert `scripts/check-frontend-host.ts`
- delete this log

## Stop summary

- stopped after widening the gap-pressure visibility surface
- did not broaden into a full Engine report-schema redesign or change routing policy
