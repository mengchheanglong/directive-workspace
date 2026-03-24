# Accepted Implementation Bundle 37: Source-Pack Catalog Cleanup

Date: 2026-03-21
Owner: Directive Discovery -> Directive Forge
Decision state: `route_to_forge_follow_up`
Adoption target: `Directive Forge follow-up`
Status: accepted

## Decision

Close Forge System Bundle 03 by separating source-pack cutover completeness from live runtime activation.

## Outcome

- added canonical source-pack catalog classification
- changed host activation rule from readiness-only to readiness-plus-classification
- cleaned the tooling catalog so it reflects actual Forge source-pack roots and pack classes

## Next active Forge work

Forge System Bundle 04: promotion-profile family normalization
