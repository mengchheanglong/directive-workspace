# 2026-04-04 - dw-state architecture finder dedup

- Scope: Opportunity 2 of the bounded optimization frontier.
- Change: replaced the repeated Architecture deep-tail `listFiles` + `try/read` + linked-path comparison loops in `shared/lib/dw-state.ts` with one shared `findLinkedArchitectureArtifact` helper.
- Preserved behavior:
  - existing stage-specific finder function names stayed in place
  - traversal order and filesystem read behavior stayed the same
  - `findArchitectureReopenedStartForEvaluation` kept its `{ path, artifact }` return shape
- Proof:
  - `npm run check:architecture-materialization-due-check` passed
  - `npm run check:directive-workspace-composition` passed
  - `npm run check:host-adapter-boundary` passed
  - `npm run check` passed
- Rollback: restore the prior per-stage finder implementations in `shared/lib/dw-state.ts`.
