# Frontend Build Check Deduplication

- Affected layer: host-facing verification scripts
- Owning lane: shared operator/check surface supporting Runtime host proof
- Mission usefulness: reduce repeated frontend builds during verification without weakening check coverage
- Proof path:
  - `npm run check:frontend-host`
  - `npm run check:directive-scientify-dw-web-host-runtime-promotion`
  - `npm run check:directive-temporal-durable-execution-dw-web-host-runtime-promotion`
  - `npm run check`
- Rollback path: revert the helper adoption and restore per-script `npm run frontend:build` calls

Completed:
- added `scripts/ensure-frontend-build.ts`
- migrated all frontend-host check scripts that previously rebuilt the frontend directly
- switched those scripts to a freshness-aware shared helper

Stop summary:
- host/runtime verification still passes
- repeated frontend rebuild pressure in the check suite is reduced
