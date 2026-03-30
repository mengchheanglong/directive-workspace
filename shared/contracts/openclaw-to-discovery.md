# OpenClaw To Discovery Contract

Last updated: 2026-03-23

## Purpose

Define how OpenClaw can submit mission-relevant capability signals into Directive Discovery without bypassing the Discovery front door.

This is a product-owned contract.
The active bounded implementation is the OpenClaw-root helper:

- `C:\Users\User\.openclaw\scripts\submit-openclaw-discovery-candidate.ps1`

Mission Control also exposes the same bounded host API surface:

- `C:\Users\User\.openclaw\workspace\mission-control\src\app\api\directive-workspace\discovery\submissions\route.ts`

The authoritative Discovery target remains:

- `discovery/intake-queue.json`

## Submission Interface

OpenClaw may submit a Discovery candidate by:

1. providing a valid submission payload
2. calling the root helper
3. letting the helper use the canonical Discovery submission router
4. letting that router append one new queue entry and, when enough structured detail is supplied, automatically choose:
   - `queue_only`
   - `fast_path`
   - `split_case`

Optional:
- a human-readable fast-path markdown record may be created immediately through the same bounded payload
- a split intake/triage/routing/completion record set may be created through the same bounded payload when the candidate is complex enough

The queue entry is the minimum required submission.
Minimal OpenClaw payloads still enter as queue-only pending items by default.

## Required Submission Fields

- `candidate_id`
- `candidate_name`
- `source_reference`

## Optional Submission Fields

- `source_type`
- `mission_alignment`
- `capability_gap_id`
- `notes`

## Submission Rules

- OpenClaw submits only to Discovery
- OpenClaw must not route directly to Runtime or Architecture
- OpenClaw must not modify existing Discovery records
- OpenClaw submissions always enter as:
  - `status: pending`
  - `routing_target: null`
- OpenClaw must not mark items completed, deferred, rejected, or promoted
- OpenClaw must not bypass the Discovery queue even for internal signals

## Allowed Signal Sources

- Telegram user messages that describe a capability need or external tool
- maintenance loop observations that identify a repeated capability weakness
- health or regression checks that expose a weak lane
- operator-initiated internal submission
- session-derived observations where an agent identifies a real capability limitation

## Signal Quality

Submissions should include:

- a candidate name that describes the capability need or source
- a source type from the queue schema enum
- mission alignment if the signal relates to the active objective
- a capability gap id only if the signal clearly addresses a currently open gap; otherwise leave it `null`

## Bounded Implemented Path

Implemented in this slice:

- root submission helper
- unified Discovery submission router
- queue-safe append behavior
- duplicate candidate protection
- open gap validation when `capability_gap_id` is provided
- dry-run mode for host verification
- automatic `queue_only | fast_path | split_case` selection from one payload
- host checker: `npm run check:openclaw-discovery-submission`
- one exercised real submission: `dw-openclaw-discovery-submission-flow`
- one bounded upstream signal adapter: `C:\Users\User\.openclaw\scripts\submit-openclaw-runtime-verification-signal.ps1`
- one bounded maintenance/watchdog upstream signal adapter: `C:\Users\User\.openclaw\scripts\submit-openclaw-maintenance-watchdog-signal.ps1`

Not implemented in this slice:

- direct Telegram-to-Discovery bridge
- automatic maintenance-loop submission
- n8n webhook submission
- external gateway API submission

Those remain future follow-up surfaces, but the contract no longer depends on queue shadow mode or an unresolved stability decision.

## Operating Result

As of `2026-03-22`, OpenClaw can submit a bounded Discovery candidate through:

1. `C:\Users\User\.openclaw\scripts\submit-openclaw-discovery-candidate.ps1`
2. `C:\Users\User\.openclaw\workspace\mission-control\src\app\api\directive-workspace\discovery\submissions\route.ts`
3. `discovery/intake-queue.json`
4. `npm run check:openclaw-discovery-submission`

That path is active, checked, and exercised.

Active bounded upstream signal sources now include:

- direct operator/root helper submission
- stale OpenClaw runtime verification signal submission
- degraded maintenance/watchdog state submission
