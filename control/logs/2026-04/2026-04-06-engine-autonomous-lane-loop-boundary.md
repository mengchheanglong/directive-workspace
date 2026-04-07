# 2026-04-06 Engine Autonomous Lane Loop Boundary

- Affected layer: Engine coordination
- Owning lane: Engine core coordinating Discovery, Runtime, and Architecture lane transitions
- Mission usefulness: remove repeated manual approval clicks across already-machine-safe lane steps while keeping explicit stop-lines where new evidence or judgment is still required
- Proof path: `npm run check:autonomous-lane-loop`, `npm run check:directive-workspace-composition`, `npm run check:runtime-loop-control`
- Rollback path: revert `engine/coordination/autonomous-lane-loop.ts`, `control/state/autonomous-lane-loop-policy.json`, `scripts/run-autonomous-lane-loop.ts`, `scripts/check-autonomous-lane-loop.ts`, and the package/batch exports

## Change

- Added an opt-in autonomous lane loop core at `engine/coordination/autonomous-lane-loop.ts`.
- Added explicit control policy at `control/state/autonomous-lane-loop-policy.json`.
- Added a thin script surface at `scripts/run-autonomous-lane-loop.ts`.
- The loop can:
  - submit one Discovery front-door request
  - auto-open a clean Runtime or Architecture route
  - auto-start Runtime through follow-up -> record -> proof -> capability-boundary -> promotion-readiness
  - auto-start Architecture handoff -> bounded-start
  - auto-adopt an Architecture bounded result
  - auto-open an Architecture implementation target when the adoption is explicitly `adopt_planned_next`
- The loop stops when:
  - routing still needs human review or confidence is too low
  - no machine-safe transition is open from the current stage
  - the configured action cap is reached

## Guardrails

- No queue/status mutation happens outside the already-existing lane openers and writers.
- The loop does not invent Runtime promotion records or execution.
- The loop does not invent Architecture implementation-result evidence.
- Discovery remains the source front door.
