# Temporal Source Preservation

Date: 2026-03-31
Track: Directive Discovery
Type: source preservation
Status: preserved for later gated Architecture review

## Source Name

Temporal

## Primary URLs

- https://docs.temporal.io/
- https://temporal.io/
- https://github.com/temporalio/temporal

## What Missing Layer It Fills

Temporal is the strongest preserved reference for the durable execution and resumability layer that Directive Workspace may eventually need if orchestration pain shifts from modeling to crash-proof long-running execution.

The relevant pressure is not "workflow engine adoption" in general.
The relevant pressure is:
- durable workflow state
- resumable execution
- long-running coordination that survives restarts and failures
- clearer separation between command intent, execution history, and replayable progress

## Why It Is Not First

Temporal is not first because the current priority is not yet durable execution infrastructure.

The earlier question is whether the next real gap is better solved by Roam-code's local-first investigation and then, if needed, Backstage's entity/control-plane modeling.
Opening Temporal first would front-load execution durability and orchestration baggage before the repo has proven that durable execution is the next seam.

## What Would Trigger Reopening It After Backstage

Reopen Temporal only if Phase B finishes and explicitly shows that the remaining gap is durable execution, resumability, retry-safe long-running work, or crash-proof continuation rather than modeling or control-plane structure.

Valid reopen triggers include:
- earlier phases prove the system knows what should happen but cannot preserve or resume long-running progress cleanly
- operator pain shifts from modeling ambiguity to durable execution and replay
- the next bounded Architecture question becomes execution-state persistence rather than entity definition

## Why It Is Design-Reference-Now / Spike-Later Rather Than Immediate Adoption

Temporal is design-reference-now because its value is architectural framing for durable execution, not immediate platform adoption in this thread.

Immediate adoption is not justified because:
- it would broaden into runtime and orchestration implementation
- it would add heavy infrastructure assumptions before the earlier phases close
- it would risk solving a later-stage durability problem before the repo proves that durability is the next real product pressure

## Bounded Next-Use Condition

Use this source next only for one bounded Architecture evaluation slice that asks:

"After Phase A and Phase B close, is durable execution now the highest-ROI missing layer?"

If that answer is not explicit, keep Temporal parked as preserved reference material.
