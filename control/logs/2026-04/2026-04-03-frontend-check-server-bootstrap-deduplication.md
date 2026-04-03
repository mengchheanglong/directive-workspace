# Frontend Check Server Bootstrap Deduplication

- Affected layer: host-facing verification scripts
- Owning lane: shared operator/check surface supporting Runtime host proof
- Mission usefulness: remove repeated frontend build, server startup, fetch, and teardown logic from web-host checks
- Proof path:
  - `npm run check:frontend-host`
  - `npm run check:host-adapter-boundary`
  - `npm run check`
- Rollback path: revert `scripts/frontend-check-helpers.ts` adoption and restore per-check bootstrap code

Completed:
- added `scripts/frontend-check-helpers.ts`
- centralized frontend check build freshness, server startup, JSON fetch, and teardown flow
- migrated the web-host Runtime promotion and implementation checks plus `check-frontend-host.ts` to the shared bootstrap helper

Stop summary:
- host-facing verification no longer duplicates obvious server bootstrap logic
- frontend-host and host-adapter verification still pass

