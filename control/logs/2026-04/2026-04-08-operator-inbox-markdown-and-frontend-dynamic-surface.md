# 2026-04-08 - Operator Inbox Markdown And Frontend Dynamic Surface

## Bounded Slice

- Affected layer: Engine coordination reporting plus product-owned web frontend surface.
- Owning lane: Engine coordination, with Discovery and Runtime decision gates surfaced read-only.
- Mission usefulness: make current review/host-selection/registry decision pressure visible to the operator without static frontend claims or workflow mutation.
- Proof path: operator inbox checker, markdown report writer, frontend build, hosted frontend browser check, composition check, and full product check.
- Rollback path: revert `engine/coordination/operator-decision-inbox.ts`, `scripts/check-operator-decision-inbox.ts`, `scripts/report-operator-decision-inbox-markdown.ts`, `hosts/web-host/server.ts`, `frontend/src/app-types.ts`, `frontend/src/app.ts`, `frontend/src/app-styles.ts`, `scripts/check-frontend-host.ts`, `package.json`, `README.md`, and remove `control/reports/operator-decision-inbox.md`.
- Stop-line: read-only operator surfacing only; no route resolution, host-selection writing, host adapter execution, registry writing, automation enablement, or broad frontend redesign.

## Changes

- Added Markdown rendering for `operator_decision_inbox.v1` with Runtime host-selection decisions prioritized before registry and Discovery review groups.
- Added `report:operator-decision-inbox-markdown`, which writes `control/reports/operator-decision-inbox.md`.
- Added `GET /api/operator-decision-inbox` to the web host.
- Updated the frontend home page and new `/operator-inbox` route to read live inbox data from the API instead of static review-load claims.
- Removed the stale static Runtime overview wording and replaced it with current dynamic lane/inbox state.

## Validation

- `npm run check:operator-decision-inbox`
- `npm run report:operator-decision-inbox-markdown`
- `npm run frontend:build`
- `npm run check:frontend-host`
- `npm run check:directive-workspace-composition`
- `npm run check`

## Safety Notes

- The inbox remains read-only and exposes guardrails in both Markdown and frontend views.
- The frontend displays resolver commands/artifact paths but does not execute them.
- The web host endpoint only reads Engine coordination state and does not mutate workflow artifacts.
