# OpenClaw Runtime Verification Freshness Slice 01

Date: `2026-03-22`
Candidate: `dw-openclaw-runtime-verification-freshness-2026-03-22`
Track: `Directive Architecture`
Gap id: `gap-discovery-front-door-coverage`

## Claim

Discovery behaves more like the real front door when OpenClaw can surface stale runtime verification evidence as a bounded internal signal, instead of letting orchestration health drift away from recent proof without creating work.

## Bounded change

Create and exercise one bounded upstream signal path:

- one product-owned contract describing stale verification as a Discovery signal
- one root helper that reads existing regression and soak reports
- one host checker using fixture-based dry-run validation
- one real queue submission from the live stale reports
- one completed Discovery-first Architecture slice linked back to the front-door gap

Do not:
- add schedulers or automatic recurring submission
- scrape broad logs
- treat healthy runtime state as a reason to skip verification freshness concerns

## Proof method

Pass if all of the following are true:
1. The root helper detects stale verification from the live reports.
2. The helper can dry-run cleanly against fixture files through a host checker.
3. One real candidate enters the Discovery queue through the helper.
4. The queue candidate is completed through the normal Discovery-first path.

## Result

Accepted.

OpenClaw can now surface stale verification evidence into Discovery through a bounded helper, and the front-door gap has one more real upstream source instead of relying only on manual or backfilled intake.
