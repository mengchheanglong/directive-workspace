# Agency-Agents Registry Entry

- Candidate id: agency-agents
- Candidate name: agency-agents
- Registry date: 2026-03-21
- Linked promotion record: `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\promotion-records\2026-03-21-agency-agents-promotion-record.md`
- Host: Mission Control
- Runtime surface: run-scoped specialist pack sync and rollback lane
- Runtime status: callable (legacy-live-specialist-pack-lane)
- Proof path: `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\records\2026-03-21-agency-agents-runtime-slice-01-proof.md`
- Last validated by: `npm run check:directive-live-runtime-accounting`
- Last validation date: 2026-03-21
- Active risks: runtime status depends on curated directory scope, manifest integrity, and bounded sync/rollback behavior remaining unchanged.
- Rollback path: use the rollback section in the promotion record and restore the pack to `follow_up_only` if the lane widens or evidence drifts.
- Notes: callable status is bounded to run-scoped sync and rollback against the Runtime-owned pack; it does not imply that the upstream persona repo is active runtime truth.
