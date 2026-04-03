# Roam Route Superseded Engine Selection Truth Hardening

## Cycle 1

### Chosen task
Harden Discovery route focus so an explicit later reroute can supersede a stale earlier engine lane when the queue target and downstream head already agree with the newer route.

### Why this slice won
Current repo truth exposed one live broken anchor: the Roam Phase A / Phase 2 routing record was marked inconsistent only because the earlier Phase 1 engine run still reported `hold_in_discovery`, even though the explicit later routing record, queue target, and downstream Architecture bounded result all agreed.

### Affected layer
- Shared Engine workspace-state resolution for Discovery routing records

### Owning lane
- Architecture

### Mission usefulness
- Restores truthful route focus for a real parked case without rewriting history, so the product report stops overstating a broken anchor when the later explicit route already governs the case.

### Proof path
- Update `shared/lib/dw-state.ts` so Discovery route focus treats the later route as authoritative when the downstream head and queue target already match it.
- Add one composition-check assertion on the real Roam Phase A / Phase 2 routing record.

### Rollback path
- Revert the bounded resolver change, the matching composition-check assertion, and this control log.

### Stop-line
- Stop after this one state-truth correction. Do not reopen Roam, Backstage, Temporal, or the parked negative-path seam.

### Files touched
- `shared/lib/dw-state.ts`
- `scripts/check-directive-workspace-composition.ts`
- `control/logs/2026-03/2026-03-31-roam-route-superseded-engine-selection-truth-hardening.md`

### Verification run
- `npm run report:directive-workspace-state -- discovery/routing-log/2026-03-31-dw-source-roam-code-2026-03-31-phase-a-phase-2-routing-record.md`
- `node --experimental-strip-types ./scripts/check-directive-workspace-composition.ts`
- `npm run report:directive-workspace-state`
- `npm run check`

### Result
- The Roam Phase A / Phase 2 routing record now resolves cleanly to the Architecture bounded-result current head instead of remaining blocked by the superseded Phase 1 engine lane.
