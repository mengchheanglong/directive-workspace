# 2026-04-06 Research Engine Open Deep Research Native Code Integration Seam

- affected layer: Discovery front door import seam
- owning lane: Discovery with shared Engine routing
- mission usefulness: preserve real source-structure metadata from Research Engine so Discovery can route native research imports into Architecture truthfully instead of losing the code-integration signal at intake
- proof path:
  - `npm run check:research-engine-discovery-import`
  - `npm run check:autonomous-lane-loop`
  - `npm run check:directive-workspace-composition`
  - `npm run import:research-engine-discovery-bundle -- --bundle discovery/research-engine/artifacts-live-test --candidate-id open-deep-research --received-at 2026-04-06T15:55:00.000Z`
  - `npm run run:autonomous-lane-loop -- --artifact discovery/03-routing-log/2026-04-06-research-engine-open-deep-research-20260406t145339z-20260406t155500z-routing-record.md`
- rollback path:
  - revert `hosts/adapters/research-engine-discovery-import.ts`
  - revert `discovery/lib/discovery-front-door.ts`
  - revert `scripts/check-research-engine-discovery-import.ts`
  - remove the live imported `research-engine-open-deep-research-*` Discovery artifacts if needed

## What changed

- enriched the Research Engine Discovery adapter so imported candidates preserve structured Engine-routing metadata:
  - `primary_adoption_target`
  - `contains_executable_code`
  - `contains_workflow_pattern`
  - `improves_directive_workspace`
  - `workflow_boundary_shape`
- extended the Research Engine import checker with an explicit `open-deep-research` candidate-id path that proves native import can route a real structural source into Architecture
- fixed the Discovery front-door projection payload so routing records preserve:
  - mission priority score
  - routing confidence
  - route conflict
  - needs-human-review
  - ambiguity summary
  - review guidance
  - routing explanation breakdown

## Result

- native Research Engine import now routes `open-deep-research` through Discovery into Architecture on the live repo
- the autonomous loop no longer stops because routing data is missing
- the live stop-line is now truthful:
  - routing confidence is `medium`
  - route conflict is `yes`
  - needs human review is `yes`
- this means the source is now integrated into the system as a real Discovery-to-Architecture candidate, but it is not eligible for automatic downstream Architecture execution under the current autonomy policy

## Stop-line

No further automatic code integration was opened in this slice because the live source still fails the autonomous review gate on real routing truth, not due to a missing phase or broken artifact surface.
