# Workspace Truth Overstated Next-Step Architecture Result Detail Hardening

Cycle 1

Chosen task:

Harden one overstated-next-step mismatch in the frontend detail surface: a stale Architecture bounded-result detail should not leave the raw artifact-era `nextDecision` as the only forward-looking signal after the live case has already reopened downstream.

Why this slice won:

- It is a singular, machine-checkable overstatement in a real current repo chain.
- The shared resolver already knows the truthful current head and next legal step.
- The fix stays narrow: one detail reader, one proof, no policy rewrite.

Affected layer:

Frontend Architecture detail reporting backed by shared workspace-state resolution.

Owning lane:

Architecture.

Mission usefulness:

Make bounded-result detail views honest about live continuation by surfacing canonical current-stage and next-step truth whenever the inspected result artifact is no longer the live continuation point.

Proof path:

- Keep the slice inside overstated next steps only.
- Harden `readDirectiveFrontendArchitectureResultDetail(...)` in `hosts/web-host/data.ts` so it resolves and returns canonical `artifactNextLegalStep`, `currentStage`, `nextLegalStep`, and `currentHead`.
- Prove the change against the real GPT Researcher continuation bounded-result artifact, whose raw `nextDecision` still says `needs-more-evidence` while the live case has already reopened downstream.
- Verify the detail surface now exposes the reopened current stage and the canonical next legal step, while preserving the raw artifact-era field for auditability.

Rollback path:

- Revert the detail-reader change in `hosts/web-host/data.ts`.
- Revert the proof addition in `scripts/check-directive-workspace-composition.ts`.
- Remove this control log.

Stop-line:

Stop after this one detail-surface overstatement is hardened and verified. Do not widen into other Architecture detail readers, queue taxonomy, or shared next-step policy rewrites in the same cycle.

Files touched:

- `hosts/web-host/data.ts`
- `scripts/check-directive-workspace-composition.ts`
- `control/logs/2026-03/2026-03-31-workspace-truth-overstated-next-step-architecture-result-detail-hardening.md`

Verification run:

- `node --experimental-strip-types ./scripts/check-directive-workspace-composition.ts`
- `npm run report:directive-workspace-state`
- `npm run check`

Result:

The stale Architecture bounded-result detail surface now carries canonical current-stage, current-head, and next-step truth from the shared resolver, so the raw artifact-era `nextDecision` no longer stands alone as an overstated forward-looking signal.
