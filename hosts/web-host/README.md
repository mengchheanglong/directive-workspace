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
- Engine runs list
- Engine run detail
- queue view
- handoff list/detail
- Architecture bounded-start trigger/view
- bounded Architecture result/closeout trigger/view

Current honest limitation:
- frontend submission can create queue entries and Engine runs
- it does not yet materialize downstream handoff stubs from that path the way Mission Control does

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
