# Forge Wave 01 Shortlist

Date: 2026-03-21
Owner: Directive Forge
Status: closed
Cycle position: post-Architecture current-cycle closure
Reprioritized: 2026-03-21 after promptfoo slice and source-pack activation hardening
Closed: 2026-03-21 after agent-orchestrator precondition correction

## Purpose

Open the next bounded Forge execution wave after the current Architecture cycle closed.

Wave 01 remains the first real Forge runtime cycle, but it is now explicitly system-first.

Before opening broader runtime candidates, Forge should close the operational debt that would make later runtime slices noisy, ambiguous, or unsafe.

Wave 01 is now closed because:
- the completed runtime anchors (`promptfoo`, `puppeteer`, `skills-manager`) exist
- the core system bundles 02-04 are complete
- `agent-orchestrator` has been corrected out of false live-runtime state and moved to blocked follow-up until its runnable CLI precondition is met

## Selection Rule

A Wave 01 item qualifies only if all of the following are true:
- the adoption target is clearly Forge, not Architecture
- the next slice improves callable/runtime safety, runtime readiness, or bounded runtime value
- rollback can return the system to follow-up or reference-only state without contaminating the host

## Completed Anchor Slice

### `al-tooling-promptfoo`
- Current state:
  - bounded Forge runtime slice completed
  - promotion record and registry entry exist
  - dedicated `agent_eval_guard/v1` contract family is in place
- Why it stays first:
  - it is the completed proof anchor for the Wave 01 runtime lane
  - it proves Forge can promote one bounded callable surface without treating the whole upstream repo as runtime truth
- Rule:
  - do not use promptfoo completion as justification to skip remaining Forge system cleanup

## Active System Queue

### 1) Forge System Bundle 02: mirror and package boundary inventory
- Status:
  - completed on 2026-03-21
- Why this is active now:
  - Forge core and shared-lib mirrors still exist in Mission Control
  - package consumption remains explicitly deferred in current docs
  - before opening more runtime surfaces, Forge needs a clean inventory of what is canonical, mirrored, and still host-only
- Expected outputs:
  - one Forge-owned inventory/decision artifact
  - one explicit keep/move/defer table for package/import cutover
  - no speculative runtime cutover yet

### 2) Forge System Bundle 03: source-pack catalog and activation cleanup
- Status:
  - completed on 2026-03-21
- Why this is next:
  - source-pack readiness is now enforced for runtime resolution
  - Forge still needs a cleaner distinction between:
    - live runtime packs
    - cutover-only packs
    - documentation/reference packs
- Expected outputs:
  - one inventory/registry cleanup pass
  - one explicit live-pack classification
  - no new external runtime slice until the pack surface is less ambiguous

### 3) Forge System Bundle 04: promotion-profile family normalization
- Status:
  - completed on 2026-03-21
- Why this remains in queue:
  - promptfoo exposed that Forge has more than one promotion-proof family
  - the current product surface should make those families explicit before more callable lanes are added
- Expected outputs:
  - one normalized inventory of active promotion profiles
  - clearer boundary between profile family, proof shape, and host checker

## Runtime Queue After System Bundles

### 1) `al-tooling-puppeteer`
- Current state:
  - bounded Forge runtime slice completed on 2026-03-21
  - promotion record and registry entry exist
  - dedicated `browser_smoke_guard/v1` contract family is in place
- Why queued:
  - clear Forge runtime value
  - host-fit is strong
  - browser wrapper surface is broader than promptfoo and should not open before system bundles 02-04 are closed

### 2) `al-tooling-skills-manager`
- Status:
  - bounded Forge runtime slice completed on 2026-03-21
  - promotion record and registry entry exist
  - dedicated `skill_lifecycle_guard/v1` contract family is in place
- Why queued:
  - important Forge lifecycle/governance value
  - becomes safer once catalog and source-pack classification are cleaner

### 3) `al-tooling-agent-orchestrator`
- Status:
  - blocked follow-up
- Why queued:
  - high value, but highest complexity and widest runtime assumption surface
  - should follow system cleanup plus at least one more smaller runtime slice
  - Forge-owned pack is currently missing the runnable CLI artifact required by the host (`packages/cli/dist/index.js`)
- Rule:
  - do not open runtime proof/promotion work until the CLI precondition is met and the catalog can be reclassified honestly

## Explicit Non-Selection

### `al-parked-cli-anything`
- Reason:
  - remains formally deferred
  - re-entry preconditions are still unmet

### `al-parked-desloppify`
- Reason:
  - still low-priority utility value
  - no concrete host need is active

### `al-parked-hermes-agent`
- Reason:
  - surviving utility value exists, but not higher priority than the active system queue

### `al-tooling-software-design-philosophy-skill`
- Reason:
  - useful cutover item, but closer to asset migration than bounded runtime proof

## Execution Order

1. completed: `al-tooling-promptfoo`
2. completed: Forge System Bundle 02
3. completed: Forge System Bundle 03
4. completed: Forge System Bundle 04
5. completed: `al-tooling-puppeteer`
6. completed: `al-tooling-skills-manager`
7. blocked: `al-tooling-agent-orchestrator` until runnable CLI precondition is met

## Validation Rule

Wave 01 planning and system cleanup use the lighter Forge planning bundle first:
- `npm run check:directive-workflow-doctrine`
- `npm run directive:sync:reports`
- `npm run check:directive-workspace-report-sync`

Escalate to host-facing validation when a system bundle changes host resolution, source-pack activation, promotion profiles, or runtime execution path.

## Success Condition

Wave 01 is in a good state when:
- promptfoo remains the explicit completed runtime proof anchor
- system bundles are prioritized ahead of broader runtime expansion
- lower-priority follow-ups are intentionally queued or deferred
- Architecture-closed items are not reopened by mistake
- no source pack remains falsely classified as `live_runtime`
