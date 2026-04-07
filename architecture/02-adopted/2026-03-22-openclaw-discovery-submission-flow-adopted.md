# OpenClaw Discovery Submission Flow Adopted

Date: `2026-03-22`
Candidate: `dw-openclaw-discovery-submission-flow`
Decision: `accept for architecture`
Status: `product_materialized`

Materialized outputs:
- `shared/contracts/openclaw-to-discovery.md`
- `shared/schemas/openclaw-discovery-submission.schema.json`
- `C:\Users\User\.openclaw\scripts\submit-openclaw-discovery-candidate.ps1`
- `mission-control/scripts/check-openclaw-discovery-submission.ts`

Why it matters:
- OpenClaw can now submit a real bounded candidate into Discovery without bypassing the front door
- the submission path is no longer only doctrinal; it has been exercised once end to end
- the front-door coverage gap now improves through real upstream coordination, not only internal backfill

Boundary:
- this does not add webhook, Telegram, or gateway ingestion
- this keeps OpenClaw limited to queue submission only; routing still belongs to Discovery
