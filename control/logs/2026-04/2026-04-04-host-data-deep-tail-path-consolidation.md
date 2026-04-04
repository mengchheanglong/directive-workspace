# 2026-04-04 - host data deep-tail path consolidation

- Scope: Opportunity 3 of the bounded optimization frontier.
- Change: replaced the repeated deep-tail sibling-path readers in `hosts/web-host/data.ts` with one shared local helper that derives the next artifact path from the stage map and verifies that the candidate artifact exists.
- Preserved behavior:
  - kept the adoption and reopened-start path helpers separate because they use different naming rules
  - kept the host import boundary unchanged after the initial attempt to import a broader shared helper failed `check:host-adapter-boundary`
  - kept response shapes and path nullability unchanged
- Proof:
  - `npm run check:frontend-host` passed
  - `npm run check:host-adapter-boundary` passed
  - `npm run check:directive-workspace-composition` passed
  - `npm run check` passed
- Rollback: restore the prior per-stage deep-tail path helpers in `hosts/web-host/data.ts`.
