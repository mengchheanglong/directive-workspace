# Forge Wave 03 Shortlist

Date: 2026-03-21
Owner: Directive Forge
Status: closed
Cycle position: post-Wave-02 queue refresh

## Purpose

Open the next Forge wave only after Wave 02 has fully closed:
- import-pack behavior is aligned with catalog policy
- every live runtime pack has explicit lifecycle accounting
- bounded import/runtime candidates are either promoted or explicitly blocked

Wave 03 should not widen the runtime surface blindly. It focused on the next honest residual debt:
- a bounded AO CLI follow-up after the precondition proof
- then a narrow decision on whether the host AO surface should be promotable or remain `follow_up_only`

## Selection Rule

A Wave 03 item qualifies only if:
- it reduces a real blocked-runtime dependency
- or it proves one narrow missing precondition for an already-routed Forge candidate
- rollback can restore the candidate to `blocked` or `follow_up_only` without leaving half-live runtime truth behind

## Active Candidate

### 1) `al-tooling-agent-orchestrator`
- Status:
  - completed as keep-`follow_up_only`
- Why this is next:
  - all other selected Wave 02 candidates are already promoted
  - the missing CLI precondition is proven
  - one bounded AO CLI host use case is now proven
  - the remaining question is whether the existing host AO adapter surface can be narrowed enough for promotion
- Boundaries:
  - do not reopen the dashboard, mobile app, or full plugin ecosystem as product truth
  - do not mark the pack `live_runtime` during the CLI follow-up slice
  - prove only one bounded CLI use case with explicit rollback
- Outputs delivered:
  - AO CLI precondition proof
  - bounded AO CLI runtime slice 01
  - explicit keep-as-`follow_up_only` host-adapter decision

## Explicit Non-Selection

### `al-parked-cli-anything`
- Reason:
  - re-entry contract is still unmet
  - command-mediation contract and approval policy are not yet strong enough to reopen execution risk

### `al-parked-hermes-agent`
- Reason:
  - surviving value has already been absorbed through Architecture
  - remaining Forge value is utility/reference level only, not a higher-priority runtime lane

### `al-tooling-agency-agents`
- Reason:
  - already normalized as a bounded legacy live-runtime lane

### `al-parked-desloppify`
- Reason:
  - already normalized as a bounded legacy live-runtime lane

### `al-tooling-impeccable`
- Reason:
  - remains reference/import sample only; not promoted as a bounded Forge lane

### `al-tooling-celtrix`
- Reason:
  - remains reference/import sample only; not promoted as a bounded Forge lane

## Execution Order

1. completed: Forge Wave 02 system cleanup
2. completed: `al-tooling-arscontexta`
3. completed: `al-tooling-software-design-philosophy-skill`
4. completed: `al-tooling-superpowers`
5. completed: AO CLI precondition proof for `al-tooling-agent-orchestrator`
6. completed: AO CLI runtime slice 01 (`ao status --json`) for `al-tooling-agent-orchestrator`
7. completed: AO host-adapter decision for `al-tooling-agent-orchestrator`
8. deferred until re-entry rules are met: `al-parked-cli-anything`

## Success Condition

Wave 03 is complete when:
- the AO CLI follow-up is proven useful
- the AO decision is explicit instead of ambiguous host drift
- no blocked candidate is left in ambiguous half-live state
