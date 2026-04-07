# Runtime Wave 04 Shortlist

Date: 2026-03-22
Owner: Directive Runtime
Status: active
Cycle position: post-Wave-03 queue refresh

## Purpose

Refresh the Runtime queue after:
- Wave 01 system cleanup
- Wave 02 bounded runtime promotions
- Wave 03 `agent-orchestrator` host-adapter closure

Wave 04 should open only if a real callable/runtime candidate is eligible now.
No candidate should be marked active just to keep momentum.

## Selection Rule

A Wave 04 item qualifies only if:
- it has unresolved Runtime value that is not already promoted, normalized, or explicitly closed
- re-entry preconditions are fully met
- the proposed runtime surface is narrower than the already-proven lanes
- rollback can return the item to `defer`, `reference_only`, or `follow_up_only`

## Active Candidate

- none

## Why No Candidate Is Active Yet

### `al-parked-cli-anything`
- remains deferred
- command-mediation contract exists
- approval policy exists
- host gate readiness exists
- bounded rollback/no-op evidence is still missing

### `al-tooling-agent-orchestrator`
- remains verified `follow_up_only`
- Wave 03 closed the host-adapter decision cleanly
- reopening AO now would create drift unless one narrower promotable host surface is explicitly chosen first

### `al-parked-hermes-agent`
- closed as reference-only
- surviving value already absorbed through Architecture

### already-promoted Wave 02 candidates
- `arscontexta`
- `software-design-philosophy-skill`
- `superpowers`
- no longer active queue debt

### normalized legacy live-runtime lanes
- `agency-agents`
- `desloppify`
- no longer active queue debt

## Next Valid Re-entry Triggers

1. `CLI-Anything`
- only reopen after the remaining rollback/no-op evidence is recorded for `read_only_workspace_inspect`

2. `agent-orchestrator`
- only reopen after one narrower promotable AO host adapter target is explicitly selected

3. new Discovery-routed Runtime candidate
- must arrive with explicit adoption target and bounded runtime value

## Success Condition

Wave 04 is in a good state when:
- the queue contains no fake active item
- every remaining Runtime follow-up is either completed, closed, deferred with re-entry, or follow-up-only with explicit trigger
- the next runtime slice is opened only from a real trigger
