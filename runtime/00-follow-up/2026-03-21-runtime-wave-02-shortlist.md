# Runtime Wave 02 Shortlist

Date: 2026-03-21
Owner: Directive Runtime
Status: active
Cycle position: post-Wave-01 queue refresh

## Purpose

Open the next Runtime wave only after correcting the queue around the real remaining system debt.

Wave 01 proved three bounded runtime lanes and corrected the false-live `agent-orchestrator` state.  
Wave 02 should not open another pack blindly. It should first align host import behavior and legacy live-runtime accounting with the Runtime catalog and promotion model.

## Selection Rule

A Wave 02 item qualifies only if:
- it reduces a real Runtime product/host inconsistency
- or it opens a bounded new runtime/import lane only after that inconsistency is reduced
- rollback can return the system to follow-up/reference state without leaving a half-live surface behind

## Active System Queue

### 1) Runtime System Bundle 05: import-source policy alignment
- Status:
  - completed
- Why this is first:
  - the Runtime catalog now distinguishes `live_runtime`, `follow_up_only`, and `reference_only`
  - the host import-pack lane still allows some follow-up/reference packs to surface operationally
  - default import behavior must stop implying runtime readiness for packs that are not promoted
- Expected outputs:
  - explicit rule for which classifications may be default-imported
  - explicit rule for which classifications may be explicitly imported
  - host validation that import defaults do not bypass catalog policy
- Completed result:
  - Runtime now owns `IMPORT_SOURCE_POLICY.json`
  - omitted `sources` imports only `default_import` packs
  - explicit requests may use `default_import` and `explicit_import_only`
  - blocked/reference-only packs now return `source_blocked`

### 2) Runtime System Bundle 06: legacy live-runtime normalization
- Status:
  - completed
- Why this is next:
  - `agency-agents` and `desloppify` are still live in the host
  - they predate the newer Runtime proof/promotion/registry discipline
  - Runtime needs an explicit legacy-normalization decision instead of silent grandfathering
- Expected outputs:
  - one keep/normalize table for each legacy live pack
  - either a real Runtime proof/promotion trail or an explicit legacy live-runtime contract
  - host validation that every `live_runtime` pack has declared lifecycle accounting
- Completed result:
  - `agency-agents` and `desloppify` now have explicit Runtime record/proof/promotion/registry artifacts
  - Runtime now owns `LIVE_RUNTIME_ACCOUNTING.json`
  - every `live_runtime` pack now has declared lifecycle accounting

## Runtime Queue After System Bundles

### 1) `al-tooling-arscontexta`
- Why next:
  - clean bounded operator-pack import candidate
  - already cutover-complete under Runtime ownership
  - lower complexity than `superpowers`
- Guard:
  - do not treat methodology breadth as justification for broad default activation
- Completed result:
  - promoted as an explicit-only bounded context-operator import lane
  - default import still excludes arscontexta

### 2) `al-tooling-software-design-philosophy-skill`
- Why queued:
  - bounded review-skill lane with small surface area
  - good candidate after import-source policy is clean
- Guard:
  - keep it as a compact review/import lane, not a generic packaging system
- Completed result:
  - promoted as an explicit-only bounded design-review skill import lane
  - default import still excludes the pack

### 3) `al-tooling-superpowers`
- Why queued:
  - useful workflow material survives
  - wider platform/plugin assumptions than the two candidates above
- Guard:
  - do not reopen plugin-style overlay behavior as product truth
- Completed result:
  - promoted as an explicit-only bounded workflow operator import lane
  - plugin marketplace, hook, and overlay behavior remain runtime-excluded

### 4) `al-tooling-agent-orchestrator`
- Status:
  - blocked follow-up
- Re-entry rule:
  - remains blocked until the Runtime-owned pack contains `packages/cli/dist/index.js`
  - do not reopen before a runnable CLI precondition slice succeeds

## Explicit Non-Selection

### `al-parked-cli-anything`
- Reason:
  - remains formally deferred under its re-entry contract

### `al-parked-hermes-agent`
- Reason:
  - surviving value is utility/reference level, not a higher-priority Runtime lane

### `al-parked-desloppify`
- Reason:
  - normalized as a bounded legacy live-runtime lane; not reopened as a new candidate

### `al-tooling-agency-agents`
- Reason:
  - normalized as a bounded legacy live-runtime lane; not reopened as a new candidate

### `al-tooling-impeccable`
- Reason:
  - remains reference/import sample only; not promoted as a bounded Runtime lane

### `al-tooling-celtrix`
- Reason:
  - remains reference/import sample only; not promoted as a bounded Runtime lane

## Execution Order

1. completed: Runtime System Bundle 05
2. completed: Runtime System Bundle 06
3. completed: `al-tooling-arscontexta`
4. completed: `al-tooling-software-design-philosophy-skill`
5. completed: `al-tooling-superpowers`
6. blocked until precondition is met: `al-tooling-agent-orchestrator`

## Success Condition

Wave 02 is in a good state when:
- import-pack behavior no longer bypasses catalog policy
- every `live_runtime` pack has explicit lifecycle accounting
- every currently selected bounded runtime candidate in this wave is either promoted or explicitly blocked
