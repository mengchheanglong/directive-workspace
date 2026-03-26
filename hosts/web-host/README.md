# Directive Workspace Web Host

Directive Workspace now has a real standalone frontend app plus a thin product-owned frontend host.

Structure:
- `frontend/` = canonical Vite + Lit frontend app
- `hosts/web-host/` = thin static/API host that serves the built app and calls real Directive Workspace behavior

This keeps product logic out of the frontend:
- Engine, queue, artifacts, handoffs, and Architecture-start logic stay in Directive Workspace core/shared code
- the frontend reads and writes through the real host/runtime behavior

Current frontend flows:
- source submission
- Discovery intake / triage / routing artifact creation
- Discovery routing approval -> Architecture handoff or Runtime follow-up stub
- Runtime follow-up review approval -> bounded non-executing Runtime record
- Runtime record proof approval -> bounded non-executing Runtime proof artifact
- Runtime proof runtime-capability-boundary approval -> bounded non-executing runtime capability boundary
- Runtime runtime-capability-boundary promotion-readiness approval -> bounded non-executing promotion-readiness artifact
- Engine runs list
- Engine run detail
- queue view
- handoff list/detail
- Architecture bounded-start trigger/view
- bounded Architecture result/closeout trigger/view, now with derived closeout assist from the bounded start plus linked Engine run truth
- bounded Architecture continuation-start trigger/view
- Architecture adoption/materialization trigger/view
- Architecture implementation-target trigger/view
- Architecture implementation-result trigger/view
- Architecture retention/confirmation trigger/view
- Architecture integration-record trigger/view
- Architecture consumption-record trigger/view
- post-consumption evaluation trigger/view
- reopen from post-consumption evaluation trigger/view

Current Discovery front-door boundary:
- frontend submission writes a real Discovery intake record, triage record, routing record, queue update, and persisted Engine run from one source submission
- downstream Architecture or Runtime stub opening remains a separate deliberate approval step after Discovery routing
- Runtime follow-up review remains a separate deliberate approval step after the follow-up stub and stops at one bounded non-executing Runtime record
- Runtime proof opening remains a separate deliberate approval step after the Runtime record and stops at one bounded non-executing Runtime proof artifact
- Runtime runtime-capability-boundary opening remains a separate deliberate approval step after the Runtime proof artifact and stops at one bounded non-executing runtime capability boundary
- Runtime promotion-readiness opening remains a separate deliberate approval step after the runtime capability boundary and stops at one bounded non-executing promotion-readiness artifact

Normal local development:

```bash
npm run dev
```

This prefers:
- frontend app: `http://127.0.0.1:4173`
- API host: `http://127.0.0.1:43128`

If either port is already in use, the dev command automatically chooses the next free local port and prints the actual origins.

Production-like local run:

```bash
npm run start
```

Canonical browser-level validation:

```bash
npm run check
```

That canonical `check` command now runs:
- the existing standalone frontend/host validation
- the whole-product composition checker that reuses the Architecture replay and validates current Discovery, Engine, Runtime, and Architecture truth against real product artifacts without mutating the tracked artifacts

Read-only product truth report:

```bash
npm run report:directive-workspace-state
```

That report resolves the current Directive Workspace state from real artifacts and can also focus on one artifact path:

```bash
npm run report:directive-workspace-state -- discovery/routing-log/2026-03-25-dw-real-mini-swe-agent-runtime-route-v0-2026-03-25-routing-record.md
```

In focused mode the report distinguishes:
- `artifactStage` for the inspected artifact's own boundary
- `currentStage` for the latest known case state reachable from that artifact's linked chain
- `currentHead.artifactPath` / `currentHead.artifactStage` for the current live artifact that the operator should continue from

The queue and Engine run detail views now surface that same derived current live artifact directly, so operators can see both:
- the first downstream stub recorded in queue state
- the current live artifact derived from canonical linked case truth

Low-level commands still exist when needed:

```bash
npm run frontend:build
node --experimental-strip-types ./hosts/web-host/cli.ts serve --directive-root C:/path/to/directive-workspace
```

Open the returned origin and use:
- `/`
- `/submit`
- `/engine-runs`
- `/queue`
- `/handoffs`
