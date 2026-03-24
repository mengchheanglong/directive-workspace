# Mini-SWE-Agent Registry Entry

- Candidate id: mini-swe-agent
- Candidate name: mini-swe-agent
- Registry date: 2026-03-20
- Linked promotion record: `C:\Users\User\.openclaw\workspace\directive-workspace\forge\promotion-records\2026-03-20-mini-swe-agent-promotion-record.md`
- Host: Mission Control
- Runtime surface: Directive Workspace fallback execution lane
- Runtime status: callable (bounded fallback lane)
- Proof path: `C:\Users\User\.openclaw\workspace\directive-workspace\forge\records\2026-03-20-mini-swe-agent-runtime-slice-01-proof.md`
- Last validated by: `npm run check:ops-stack`
- Last validation date: 2026-03-20
- Active risks: Windows encoding sensitivity (`cp1252` vs UTF-8) in CLI startup banner; requires explicit UTF-8 env guard.
- Rollback path: use rollback section in promotion record and remove bounded rehearsal artifacts.
- Notes: fallback surface remains sandbox-only and disabled by default for production workflows.
