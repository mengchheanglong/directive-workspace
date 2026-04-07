# OpenClaw Runtime Verification Freshness Adopted

Date: `2026-03-22`
Candidate: `dw-openclaw-runtime-verification-freshness-2026-03-22`
Decision: `accept for architecture`
Status: `product_materialized`

Materialized outputs:
- `shared/contracts/openclaw-runtime-verification-signal.md`
- `shared/schemas/openclaw-runtime-verification-signal.schema.json`
- `C:\Users\User\.openclaw\scripts\submit-openclaw-runtime-verification-signal.ps1`
- `mission-control/scripts/check-openclaw-runtime-verification-signal.ts`

Why it matters:
- OpenClaw now has a bounded machine-readable path for surfacing stale verification evidence into Discovery
- the system no longer depends on outages or human memory before stale orchestration proof becomes visible work
- Discovery-first coverage now includes a second real OpenClaw-originated signal path

Boundary:
- this is a signal adapter, not an automatic scheduler
- this does not reopen runtime lanes directly; it only produces a Discovery candidate
