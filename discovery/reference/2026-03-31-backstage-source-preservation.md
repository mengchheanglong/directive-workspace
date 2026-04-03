# Backstage Source Preservation

Date: 2026-03-31
Track: Directive Discovery
Type: source preservation
Status: preserved for later gated Architecture review

## Source Name

Backstage

## Primary URLs

- https://backstage.io/docs/overview/what-is-backstage
- https://backstage.io/docs/features/software-catalog/
- https://backstage.io/docs/features/software-catalog/system-model
- https://github.com/backstage/backstage

## What Missing Layer It Fills

Backstage is the strongest preserved reference for the entity and control-plane modeling layer that Directive Workspace does not yet have in product-owned form.

The relevant pressure is not "developer portal adoption" as a whole.
The relevant pressure is:
- explicit entity modeling
- ownership and relation modeling
- catalog-backed control-plane structure
- a clearer system model for services, tools, documents, and related product surfaces

## Why It Is Not First

Backstage is not first because the current recommendation order treats Roam-code as the better first investigation for the immediate gap.

Roam-code is first because it can answer the earlier local-first knowledge and operator-surface questions with less upfront platform weight.
Backstage is broader, heavier, and more likely to create premature catalog and control-plane expansion if opened before the first Roam-code comparison is complete.

## What Would Trigger Reopening It After Roam-code

Reopen Backstage only if Phase A finishes and explicitly shows that the deeper missing layer is entity/control-plane modeling rather than local-first capture, note-linking, or Roam-style operator flow.

Valid reopen triggers include:
- Phase A proves the next bottleneck is explicit entity typing, ownership, and relation modeling.
- Phase A shows Directive Workspace needs a stronger catalog/system-model lens to reason about product surfaces.
- Phase A closes without solving the control-plane modeling pressure and the remaining gap is clearly structural rather than execution-oriented.

## Why It Is A Design-Reference Candidate Rather Than Immediate Adoption

Backstage is being preserved as a design reference because the useful value is the model shape, catalog semantics, and control-plane framing.

Immediate adoption is not justified in this thread because:
- it would broaden into platform adoption rather than bounded planning
- it would create pressure to model many entities at once
- it would risk opening plugin, portal, and integration scope before the repo proves that entity modeling is the next real need

## Bounded Next-Use Condition

Use this source next only for one bounded Architecture slice that asks:

"Does Directive Workspace need one explicit entity/control-plane modeling artifact after Roam-code closes?"

If that answer is not explicit, keep Backstage parked as preserved reference material.
