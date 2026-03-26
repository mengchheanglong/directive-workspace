# Directive Workspace Continuation Guide

## What to read first

1. `workspace/CLAUDE.md`
2. `workspace/directive-workspace/CLAUDE.md`
3. [READ_THIS_FIRST.md](/C:/Users/User/.openclaw/workspace/directive-workspace/knowledge/continuation/READ_THIS_FIRST.md)

## What to run first

1. `npm run check`
2. `npm run report:directive-workspace-state`
3. `npm run report:directive-workspace-continuation-pack` if you need to refresh this pack

Focused example commands:

```bash
npm run report:directive-workspace-state -- discovery/routing-log/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-routing-record.md
npm run report:directive-workspace-state -- architecture/02-experiments/2026-03-24-dw-real-gpt-researcher-engine-handoff-2026-03-24-continuation-bounded-result.md
```

## Canonical truth

- Resolver: [dw-state.ts](/C:/Users/User/.openclaw/workspace/directive-workspace/shared/lib/dw-state.ts)
- Whole-product checker: [check-directive-workspace-composition.ts](/C:/Users/User/.openclaw/workspace/directive-workspace/scripts/check-directive-workspace-composition.ts)
- Current-state report: [report-directive-workspace-state.ts](/C:/Users/User/.openclaw/workspace/directive-workspace/scripts/report-directive-workspace-state.ts)

## How to interpret focused reads

- `artifactStage` / `artifactNextLegalStep`
  - what the inspected artifact itself represents
  - use this for local boundary truth
- `currentStage` / `nextLegalStep`
  - the latest reachable case state from linked artifacts
  - use this for full-case truth
- `currentHead.artifactPath` / `currentHead.artifactStage`
  - the current live artifact and its artifact-local stage
  - use this when you need the practical continuation point for the case
- `routeTarget`
  - the original Discovery route when available
  - do not mistake it for the current artifact lane on later Runtime or Architecture artifacts

Do not collapse those pairs into one meaning.

## Proven

- Discovery front door artifactization
- Shared Engine usefulness/routing persistence
- Discovery route approval into Architecture handoff
- Discovery route approval into Runtime follow-up
- Architecture bounded closeout / continuation / adoption / retained / integration / consumption / evaluation chain
- Architecture reopened re-entry and downstream reuse
- Runtime follow-up review/open boundary
- Runtime record proof-open boundary
- Runtime proof runtime-capability-boundary-open boundary
- Runtime runtime-capability-boundary promotion-readiness-open boundary
- Runtime runtime capability boundary (non-executing)
- Runtime promotion-readiness artifact (non-executing)
- Architecture composition checker
- Directive Workspace state resolver and current-state report
- Directive Workspace whole-product composition checker

## Partially built

- Discovery is operational as a front door and approval boundary, but still intentionally stops before automatic downstream work.
- Runtime is operational as a bounded non-executing v0 chain through promotion-readiness, but host-facing promotion, runtime execution, host integration, and callable implementation remain closed.
- Architecture is complete for the current bounded phase, but new work should arrive as new cases through the existing path rather than new structural mechanics.

## Intentionally minimal

- no runtime execution
- no host integration
- no callable implementation
- no promotion automation
- no lifecycle orchestration
- no automatic workflow advancement

## Not built

- runtime execution surfaces
- host integration
- callable implementation
- promotion automation
- lifecycle orchestration
- automatic downstream advancement

## Forbidden scope expansion

- new workflow advancement in truth/read/check/report work
- runtime execution or host integration
- callable implementation
- promotion automation
- lifecycle engines or orchestration
- dashboard expansion
- reconstruction of state through lane-local custom readers when the shared resolver already covers it

## Canonical examples

- Discovery -> Architecture route
  - artifact: `discovery/routing-log/2026-03-25-dw-real-karpathy-autoresearch-discovery-v0-2026-03-25-routing-record.md`
  - artifact stage: `discovery.route.architecture`
  - current stage: `architecture.handoff.pending_review`
- Discovery -> Runtime route
  - artifact: `discovery/routing-log/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-routing-record.md`
  - artifact stage: `discovery.route.runtime`
  - current stage: `runtime.promotion_readiness.opened`
- Architecture bounded result vs case state
  - artifact: `architecture/02-experiments/2026-03-24-dw-real-gpt-researcher-engine-handoff-2026-03-24-continuation-bounded-result.md`
  - artifact stage: `architecture.bounded_result.stay_experimental`
  - current stage: `architecture.post_consumption_evaluation.reopen`
- Runtime follow-up vs case state
  - artifact: `runtime/follow-up/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-follow-up-record.md`
  - artifact stage: `runtime.follow_up.pending_review`
  - current stage: `runtime.promotion_readiness.opened`
- Runtime runtime capability boundary
  - artifact: `runtime/04-capability-boundaries/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-capability-boundary.md`
  - artifact stage: `runtime.runtime_capability_boundary.opened`
  - current stage: `runtime.promotion_readiness.opened`

## Current legal next seams

### Discovery

- Use the existing Discovery front door on real sources and keep route approval explicit.
- Tighten Discovery truth only through queue/routing/evidence consistency and capability-gap linkage clarity.
- Do not add automatic downstream advancement or duplicate Engine routing/usefulness logic inside Discovery.

### Runtime

- The non-executing promotion-readiness artifact is now the current Runtime stop for the real March 25 route-proof chain.
- Further Runtime work must remain explicit, bounded, and non-executing unless a later task intentionally opens the next seam.
- Do not treat follow-up/proof records as runtime surfaces.

### Architecture

- No required new structural seam is open for the current Architecture phase; use the existing chain for new bounded cases instead of redesigning it.
- Architecture infrastructure work should stay limited to truth/checking hardening or new real-case coverage through the existing path.
- Do not reopen Architecture flow design unless product truth is broken.

### Shared Engine / Whole Product

- Use shared/lib/dw-state.ts as the canonical read surface instead of building new ad hoc state readers.
- The highest-value whole-product seam is negative-path validation hardening around broken links, stale statuses, and overstated next steps.
- Do not turn the anchor into a workflow engine, dashboard, or automation layer.

## If you are working in a specific lane

- Runtime
  - start from `discovery/routing-log/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-routing-record.md`
  - then inspect `runtime/follow-up/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-follow-up-record.md`, `runtime/03-proof/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-proof.md`, and `runtime/04-capability-boundaries/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-capability-boundary.md`
- Architecture
  - start from `discovery/routing-log/2026-03-25-dw-real-karpathy-autoresearch-discovery-v0-2026-03-25-routing-record.md`
  - then inspect `architecture/02-experiments/2026-03-24-dw-real-gpt-researcher-engine-handoff-2026-03-24-continuation-bounded-result.md` and `architecture/09-post-consumption-evaluations/2026-03-24-dw-real-gpt-researcher-engine-handoff-2026-03-24-continuation-reopened-evaluation.md`
- Discovery
  - start from the routing records and queue-linked Engine runs
  - do not duplicate usefulness/routing reasoning outside Engine
- Shared Engine / Product truth
  - start from the overview report and the whole-product checker
  - prefer truth hardening over workflow expansion
