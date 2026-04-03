# Internal Repo-Native Self-Build Phase

Date: 2026-03-31
Owner: Directive Architecture
Status: active bounded internal phase
Mode: STANDARD

## Purpose

Explicitly park the external subsystem phase program by evidence and open the next repo-native internal phase for making Directive Workspace more real through its own operating code.

This phase is about:
- shared Engine hardening
- repo-native truth/control/state surfaces
- bounded workflow realism
- making Directive Workspace more real through its own code, checks, reports, and records

This phase is not about:
- reopening Roam-code, Backstage, or Temporal by momentum
- finding another external framework
- broad redesign
- speculative platform expansion

## External phase status

The external subsystem phase program is explicitly parked by evidence:
- Phase A / Roam-code is completed and parked.
- Phase B / Backstage remains parked.
- Phase C / Temporal remains parked.
- The subsystem-pressure audit found no repeated dominant case pressure strong enough to reopen any external subsystem phase.

External phases remain preserved references, not abandoned work. They may reopen later only if fresh repo-local evidence makes one of them the highest-ROI bounded next move.

## Why the shift is justified now

- The bounded external investigations did their job: they reduced uncertainty about whether the next real gap was external subsystem adoption.
- The subsystem-pressure audit showed the stronger repeated pressure is still repo-native: local truth/check gaps, explicit bounded stops, and product-owned state/control hardening.
- Current whole-product state already resolves cleanly through the repo-native read/check surfaces:
  - `npm run report:directive-workspace-state`
  - `npm run check`

The truthful next phase is therefore internal repo-native self-build, not another external-system evaluation loop.

## First internal seam

First chosen internal seam:
- shared Engine truth/control hardening with canonical-read-surface enforcement

Why this seam wins:
- `engine/workspace-truth.ts` already names `shared/lib/dw-state.ts` as the canonical read surface for whole-product truth.
- the recent negative-path hardening run is parked, but its retained lesson is still structural: keep truth/read/check/report work anchored to the shared Engine resolver instead of drifting into ad hoc readers.
- `control/logs/2026-03/2026-03-30-dw-state-facade-boundary-source-decision.md` shows current repo pressure around protecting the `dw-state` facade boundary without broadening into speculative enforcement.
- current repo truth is clean enough that the highest-ROI next seam is not another external system, but continued repo-native hardening of the shared truth/control surface.

## First-slice rule inside this phase

The first implementation slice inside this internal seam must be:
- one exact bounded repo-native truth/control improvement
- machine-checkable or structurally meaningful
- reversible
- justified by current repo truth rather than by momentum

If no exact first slice is clearly dominant, stop after opening this phase instead of inventing work.

## Proof path

- cite the parked external phase artifacts and subsystem-pressure audit
- confirm current whole-product report/check surfaces are clean
- name the first repo-native internal seam explicitly
- keep further implementation bounded to one exact slice only if current repo truth makes it obvious

## Rollback path

- remove this phase-opening artifact if later repo truth replaces it with a more accurate phase framing

## Stop-line

Stop after the phase is explicitly opened and the first seam is named.
Only continue into one implementation slice if an exact bounded slice is already clearly dominant from current repo truth.
