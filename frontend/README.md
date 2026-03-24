# Directive Workspace Frontend App

This is the canonical standalone frontend app for Directive Workspace.

Stack:
- Vite
- Lit

Role:
- render the standalone operator frontend
- call the real Directive Workspace host APIs
- stay thin and product-logic-free

It is served by:
- `hosts/web-host/`

Build:

```bash
npm run build
```

The canonical browser-level host check lives at:

```bash
npm run check:frontend-host
```

from the Directive Workspace root.
