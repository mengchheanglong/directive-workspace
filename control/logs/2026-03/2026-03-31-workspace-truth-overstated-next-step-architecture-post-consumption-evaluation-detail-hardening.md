# Workspace Truth Overstated Next-Step Architecture Post-Consumption Evaluation Detail Hardening

## Cycle 1

### Chosen task
Harden the stale Architecture post-consumption evaluation detail reader so it exposes canonical reopened/current-head next-step truth instead of only artifact-era evaluation fields.

### Why this slice won
It was the last clearly parallel same-family frontend detail omission in the GPT Researcher reopened Architecture chain. The shared resolver already carried the truthful reopened stage, current head, and downgraded artifact-local next step, so the fix stayed narrow and machine-checkable.

### Affected layer
- Frontend Architecture detail reporting

### Owning lane
- Architecture

### Mission usefulness
- Makes the frontend detail surface report the same truthful reopened next-step boundary the canonical shared resolver already knows, reducing stale advancement cues on historical Architecture artifacts.

### Proof path
- Strengthen `scripts/check-directive-workspace-composition.ts` to assert that the stale post-consumption evaluation detail keeps the raw `decision` for auditability while also exposing canonical `artifactNextLegalStep`, `currentStage`, `nextLegalStep`, and `currentHead`.

### Rollback path
- Revert the bounded `hosts/web-host/data.ts` detail-reader change, the matching composition-check assertion, and this control log.

### Stop-line
- Stop after this one same-family detail-reader repair, then reassess whether any singular negative-path mismatch remains before continuing.

### Files touched
- `hosts/web-host/data.ts`
- `scripts/check-directive-workspace-composition.ts`
- `control/logs/2026-03/2026-03-31-workspace-truth-overstated-next-step-architecture-post-consumption-evaluation-detail-hardening.md`

### Verification run
- `node --experimental-strip-types ./scripts/check-directive-workspace-composition.ts`
- `npm run report:directive-workspace-state`
- `npm run check`

### Result
- The stale Architecture post-consumption evaluation detail now exposes canonical reopened/current-head next-step truth alongside the raw artifact-era evaluation decision.
