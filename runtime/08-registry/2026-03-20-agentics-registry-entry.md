# Agentics Registry Entry

- Candidate id: agentics
- Candidate name: agentics
- Registry date: 2026-03-20
- Linked promotion record: `runtime/07-promotion-records/2026-03-20-agentics-promotion-record.md`
- Host: Mission Control
- Runtime surface: Directive Workspace reporting and maintenance lane
- Runtime status: callable (bounded-contract, validation-first)
- Proof path: `runtime/legacy-records/2026-03-20-agentics-runtime-slice-01-proof.md`
- Last validated by: `npm run check:ops-stack`
- Last validation date: 2026-03-20
- Active risks: source-doc discipline must stay consistent; maintenance rerun is currently green (6/6) after same-day blocker fix.
- Rollback path: use rollback section in promotion record and revert bounded-callable artifacts.
- Notes: callable surface retained because outputs are deterministic and fail-closed; content quality still depends on source artifact discipline.
