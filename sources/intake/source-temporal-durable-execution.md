# Intake Source: Temporal Durable Execution

- Source type: `external-system`
- Discovered from: Codex durable-execution comparison pass for Directive Workspace
- Date registered: 2026-04-01
- Status: Active Discovery source

## References

- Product docs: https://docs.temporal.io/
- Python SDK: https://github.com/temporalio/sdk-python
- Platform repo: https://github.com/temporalio/temporal

## Upstream summary

- Temporal is a durable execution platform centered on workflows, activities, workers, task queues, signals, queries, and execution history.
- The Python SDK exposes workflow classes, activity execution, task queues, workflow handles, signals, queries, updates, heartbeats, retries, and cancellation semantics.
- The retained value for Directive Workspace is not "adopt Temporal wholesale"; it is the durable workflow model, state/history model, and operator-visible control surfaces.

## Relevance to Directive Workspace

- Potential value: a serious reference for durable execution, resumable long-running workflows, explicit run state/history, pause-or-resume style control, and workflow-level observability.
- Current bounded question: should Temporal inform a later Architecture-owned durability/control-surface slice for Directive Workspace Engine without opening runtime rollout, planner-driven execution, or host-admin execution.
- Why this source over nearby alternatives in this pass: stronger explicit workflow-state model and control surfaces than lightweight durable-job frameworks, while remaining more concrete and adoptable than broad product-category surveys.
- Follow-up boundary: Discovery capture plus NOTE-mode Architecture retention only; no dependency adoption, no cluster deployment, and no runtime execution seam opening in this thread.
