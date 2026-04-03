# Workspace Truth Stale-Status Routing-Record Fallback Hardening

Cycle 1

Chosen task:

Harden one stale-status mismatch in the queue-facing truth surface: a `routed` queue entry whose live case head has already progressed downstream should still resolve as `routed_progressed` even when `result_record_path` is absent and only `routing_record_path` remains.

Why this slice won:

- It is the narrowest remaining stale-status mismatch inside the existing queue/status seam.
- It is mechanically falsifiable with repo-local truth.
- It does not require redesigning queue status policy or touching next-step wording.

Affected layer:

Queue-facing frontend/workspace-truth status derivation.

Owning lane:

Architecture.

Mission usefulness:

Make queue status reporting more honest when the queue still records a routed case through its routing record, but the canonical current head has already advanced further downstream.

Proof path:

- Keep the slice inside stale statuses only.
- Harden `deriveFrontendQueueStatus(...)` in `hosts/web-host/data.ts` so routed-progress detection falls back to the recorded routing path when `result_record_path` is absent.
- Add one staged composition proof that removes `result_record_path` from a known routed-progress Architecture queue row while leaving the routing record and downstream chain intact.
- Verify that the staged queue entry still resolves as `routed_progressed` and warns against treating the routing record as the live continuation point.

Rollback path:

- Revert the status-derivation change in `hosts/web-host/data.ts`.
- Revert the staged proof case in `scripts/check-directive-workspace-composition.ts`.
- Remove this control log.

Stop-line:

Stop after this one stale-status mismatch is hardened and verified. Do not widen into other stale-status families or any overstated-next-step work in the same thread.

Files touched:

- `hosts/web-host/data.ts`
- `scripts/check-directive-workspace-composition.ts`
- `control/logs/2026-03/2026-03-31-workspace-truth-stale-status-routing-record-fallback-hardening.md`

Verification run:

- `node --experimental-strip-types ./scripts/check-directive-workspace-composition.ts`
- `npm run report:directive-workspace-state`
- `npm run check`

Result:

Queue status derivation no longer depends on `result_record_path` being present before it can surface a truthful `routed_progressed` state. A routed queue entry that still resolves through its routing record now stays honest when the canonical current head has already moved downstream.
