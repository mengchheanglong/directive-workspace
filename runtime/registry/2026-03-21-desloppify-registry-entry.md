# Desloppify Registry Entry

- Candidate id: desloppify
- Candidate name: desloppify
- Registry date: 2026-03-21
- Linked promotion record: `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\promotion-records\2026-03-21-desloppify-promotion-record.md`
- Host: Mission Control
- Runtime surface: run-scoped quality utility prototype lane
- Runtime status: callable (legacy-live-quality-utility-lane)
- Proof path: `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\records\2026-03-21-desloppify-runtime-slice-01-proof.md`
- Last validated by: `npm run check:directive-live-runtime-accounting`
- Last validation date: 2026-03-21
- Active risks: runtime status depends on the helper staying advisory-only, the prototype entrypoint remaining runnable, and the lane not being elevated into lifecycle truth.
- Rollback path: use the rollback section in the promotion record and restore the pack to `follow_up_only` if the helper lane widens or the proof drifts.
- Notes: callable status is bounded to the run-scoped quality utility prototype lane; it does not imply adoption of the full upstream scoring system as Directive truth.
