# Workspace Truth Stale-Status Missing Completed Result Path Hardening

Cycle 1

Chosen task:

Harden one stale-status mismatch in the queue-facing truth surface: a `completed` queue entry should stop advertising clean completion when `result_record_path` is missing, even if canonical truth can still resolve through the older routing record.

Why this slice won:

- It is a narrow, machine-checkable stale-status mismatch in the existing queue/status seam.
- It improves honesty without redesigning queue taxonomy or next-step policy.
- It is reversible and can be proved with one staged queue mutation.

Affected layer:

Queue-facing frontend/workspace-truth status derivation.

Owning lane:

Architecture.

Mission usefulness:

Prevent the queue from advertising clean completion when the explicit completion anchor is absent and the UI is only recovering live truth through an older routed artifact.

Proof path:

- Keep the slice inside stale statuses only.
- Harden `deriveFrontendQueueStatus(...)` in `hosts/web-host/data.ts` so completed rows degrade to `completed_inconsistent` when `result_record_path` is missing but the queue still resolves via `routing_record_path`.
- Add one staged composition proof that removes `result_record_path` from a known completed Discovery-monitor queue row while preserving the routing and monitor artifacts.
- Verify that the staged queue entry resolves as `completed_inconsistent` and explains that `result_record_path` is missing.

Rollback path:

- Revert the queue-status derivation change in `hosts/web-host/data.ts`.
- Revert the staged proof case and summary update in `scripts/check-directive-workspace-composition.ts`.
- Remove this control log.

Stop-line:

Stop after this one stale-status mismatch is hardened and verified. Do not widen into other stale-status families or any overstated-next-step work in the same cycle.

Files touched:

- `hosts/web-host/data.ts`
- `scripts/check-directive-workspace-composition.ts`
- `control/logs/2026-03/2026-03-31-workspace-truth-stale-status-missing-completed-result-path-hardening.md`

Verification run:

- `node --experimental-strip-types ./scripts/check-directive-workspace-composition.ts`
- `npm run report:directive-workspace-state`
- `npm run check`

Result:

Completed queue rows no longer stay deceptively clean when the queue has lost `result_record_path` and is only resolving through the older routing record. The queue now surfaces that missing completion anchor as a stale-status inconsistency.
