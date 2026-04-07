# Promptfoo Registry Entry

- Candidate id: promptfoo
- Candidate name: promptfoo
- Registry date: 2026-03-21
- Linked promotion record: `runtime/07-promotion-records/2026-03-21-promptfoo-promotion-record.md`
- Host: Mission Control
- Runtime surface: bounded agent eval harness / promotion guard lane
- Runtime status: callable (bounded-eval-lane)
- Proof path: `runtime/legacy-records/2026-03-21-promptfoo-runtime-slice-01-proof.md`
- Last validated by: `npm run check:ops-stack`
- Last validation date: 2026-03-21
- Active risks: eval dataset is intentionally small; callable status depends on continued eval guard health and regression stability.
- Rollback path: use rollback section in promotion record and revert slice-specific Runtime checker wiring.
- Notes: callable status is bounded to the existing Mission Control eval guard harness and does not imply broad runtime ownership of the full Promptfoo upstream surface.
