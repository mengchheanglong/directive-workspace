# Workspace Truth Broken Linked Artifact Path Hardening

Cycle 1

Chosen task:

Harden one negative-path class in workspace-truth resolution: broken linked artifact paths.

Why it won:

This was the narrowest, most falsifiable, and most machine-checkable whole-product truth seam left after the shortlisted-system gate decision. It also mapped directly to the repo's own stated priority around broken links.

Affected layer:

Shared workspace-truth resolution for Engine run focus surfaces.

Owning lane:

Architecture.

Mission usefulness:

Make `report:directive-workspace-state` more honest when an Engine run advertises linked artifacts that no longer exist, instead of silently resolving the focus as healthy.

Proof path:

- Keep the slice to `broken linked artifact paths`.
- Harden `resolveEngineFocus()` so it validates the paired Engine run report path and queue-linked Discovery artifacts.
- Add one staged composition-check negative case where the Engine run JSON exists but its paired report artifact is missing.
- Verify that the staged focus now resolves as `integrityState: broken` and blocks advancement.

Rollback path:

- Revert the resolver change in `shared/lib/dw-state.ts`.
- Revert the staged proof case in `scripts/check-directive-workspace-composition.ts`.
- Remove this control log.

Stop-line:

Stop after this one broken-link class is hardened and verified. Do not widen into stale-status or overstated-next-step handling in the same thread.

Files touched:

- `shared/lib/dw-state.ts`
- `scripts/check-directive-workspace-composition.ts`
- `control/logs/2026-03/2026-03-31-workspace-truth-broken-linked-artifact-path-hardening.md`

Verification run:

- `node --experimental-strip-types ./scripts/check-directive-workspace-composition.ts`
- `npm run report:directive-workspace-state -- runtime/standalone-host/engine-runs/2026-03-31T00-00-00-000Z-dw-source-roam-code-2026-03-31-4d4f5f1b.json`
- `npm run report:directive-workspace-state`
- `npm run check`

Result:

Engine-run focus no longer silently drops a missing paired report link. The resolver now keeps the expected report artifact path visible and marks the focus broken when that linked artifact is absent. The staged negative case proves that a standalone Engine run JSON without its report sibling now blocks advancement through the shared integrity gate.

Next likely move:

A new bounded decision is required before choosing whether the next truth-hardening slice should target stale statuses or overstated next steps.

Risks / notes:

- This slice intentionally did not change how `missingExpectedArtifacts` behaves for later unopened lifecycle stages. It only hardened broken linked artifact paths for Engine run focus.
