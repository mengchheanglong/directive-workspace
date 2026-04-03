# Workspace Truth Overstated Next-Step Architecture Adoption Detail Hardening

Cycle 1

Chosen task:

Harden one overstated-next-step mismatch in the frontend detail surface: a stale Architecture adoption detail should not leave the artifact-era adopted status as the only forward-looking signal after the live case has already reopened downstream.

Why this slice won:

- It is a singular, machine-checkable overstatement in the next downstream Architecture detail reader after the bounded-result fix.
- The shared resolver already knows the truthful current head and live next legal step for this stale adoption artifact.
- The fix stays narrow: one detail reader, one proof, no policy rewrite.

Affected layer:

Frontend Architecture adoption detail reporting backed by shared workspace-state resolution.

Owning lane:

Architecture.

Mission usefulness:

Make stale adoption-detail views honest about live continuation by surfacing canonical current-stage, current-head, and next-step truth whenever the inspected adoption artifact is no longer the live continuation point.

Proof path:

- Keep the slice inside overstated next steps only.
- Harden `readDirectiveFrontendArchitectureAdoptionDetail(...)` in `hosts/web-host/data.ts` so it resolves and returns canonical `artifactNextLegalStep`, `currentStage`, `nextLegalStep`, and `currentHead`.
- Prove the change against the real GPT Researcher stale adoption artifact, whose raw adopted status still reads `adopt_planned_next` while the live case has already reopened downstream.
- Verify the detail surface now exposes the reopened current stage and the canonical next legal step, while preserving the raw artifact-era fields for auditability.

Rollback path:

- Revert the detail-reader change in `hosts/web-host/data.ts`.
- Revert the proof addition in `scripts/check-directive-workspace-composition.ts`.
- Remove this control log.

Stop-line:

Stop after this one detail-surface overstatement is hardened and verified. Do not widen into other Architecture detail readers, queue taxonomy, or shared next-step policy rewrites in the same cycle.

Files touched:

- `hosts/web-host/data.ts`
- `scripts/check-directive-workspace-composition.ts`
- `control/logs/2026-03/2026-03-31-workspace-truth-overstated-next-step-architecture-adoption-detail-hardening.md`

Verification run:

- `node --experimental-strip-types ./scripts/check-directive-workspace-composition.ts`
- `npm run report:directive-workspace-state`
- `npm run check`

Result:

The stale Architecture adoption detail surface now carries canonical current-stage, current-head, and next-step truth from the shared resolver, so the raw artifact-era adopted status no longer stands alone as an overstated forward-looking signal.
