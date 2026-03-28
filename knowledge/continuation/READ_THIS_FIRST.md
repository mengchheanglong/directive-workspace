# Read This First

1. Read `workspace/CLAUDE.md`.
2. Read `workspace/directive-workspace/CLAUDE.md`.
3. Run `npm run check` from `workspace/directive-workspace`.
4. Run `npm run report:directive-workspace-state`.
5. Treat [dw-state.ts](/C:/Users/User/.openclaw/workspace/directive-workspace/shared/lib/dw-state.ts) as the canonical read surface.

How to read focused state:
- `artifactStage` / `artifactNextLegalStep`: the inspected artifact's own boundary.
- `currentStage` / `nextLegalStep`: the latest reachable case state from linked artifacts.
- `currentHead.artifactPath` / `currentHead.artifactStage`: the current live artifact to continue from; this is a derived read pointer, not queue-owned workflow state.
- `routeTarget`: the original Discovery route when available, not a claim about the current artifact lane.

Before starting any case work:
- Classify the case as **NOTE**, **STANDARD**, or **DEEP** (see `directive-workspace/CLAUDE.md` → Operating modes).
- State the stop-line for this session before executing.
- Default to NOTE if unsure. Upgrade only when justified.
- Full operating model reference: `knowledge/operating-model-v2.md`.

Do not:
- add workflow advancement from this note
- imply runtime execution, host integration, callable implementation, or promotion automation
- rebuild state through lane-local readers when the shared resolver already answers it
- continue a case past its stop-line without explicit operator justification
- treat parked cases as candidates for "next best move"

Current canonical examples:
- Discovery -> Architecture route: `discovery/routing-log/2026-03-25-dw-real-karpathy-autoresearch-discovery-v0-2026-03-25-routing-record.md`
- Discovery -> Runtime route: `discovery/routing-log/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-routing-record.md`
- Architecture keep/reopen truth: `architecture/09-post-consumption-evaluations/2026-03-24-dw-real-gpt-researcher-engine-handoff-2026-03-24-continuation-reopened-evaluation.md`
- Runtime v0 proof truth: `runtime/03-proof/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-proof.md`
- Runtime runtime capability boundary truth: `runtime/04-capability-boundaries/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-runtime-capability-boundary.md`
