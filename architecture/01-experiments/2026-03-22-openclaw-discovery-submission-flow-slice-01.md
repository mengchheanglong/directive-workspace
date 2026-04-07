# OpenClaw Discovery Submission Flow Slice 01

Date: `2026-03-22`
Candidate: `dw-openclaw-discovery-submission-flow`
Track: `Directive Architecture`
Gap id: `gap-discovery-front-door-coverage`

## Claim

Discovery behaves more like the real front door when OpenClaw can submit a bounded mission-relevant candidate into the primary queue through a product-owned helper, and that path is exercised end to end instead of left as declared contract only.

## Bounded change

Use the existing bounded OpenClaw helper to submit one real candidate, then complete the corresponding Discovery-first artifacts:

- one real queue submission through the root helper
- one Discovery intake record
- one completed queue record linked to Architecture output
- updated front-door gap and worklist state
- updated host notes so Mission Control describes the path as active, not deferred

Do not:
- add webhook ingestion
- add Telegram wiring
- add a new intake surface
- bypass Discovery routing

## Proof method

Pass if all of the following are true:
1. The root helper submits a real queue entry with `status: pending`.
2. The queue record is then completed through normal Discovery processing, with linked intake and result paths.
3. The front-door gap and worklist point to this slice as the latest improvement.
4. `npm run check:openclaw-discovery-submission` passes.

## Result

Accepted.

The root helper submitted a real queue entry for `dw-openclaw-discovery-submission-flow`, Discovery processed it into a completed Architecture slice, and the front-door gap now points to an exercised OpenClaw-originated submission path instead of a deferred coordination idea.
