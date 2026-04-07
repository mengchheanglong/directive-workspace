# Puppeteer Registry Entry

- Candidate id: puppeteer
- Candidate name: puppeteer
- Registry date: 2026-03-21
- Linked promotion record: `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\promotion-records\2026-03-21-puppeteer-promotion-record.md`
- Host: Mission Control
- Runtime surface: bounded browser smoke lane
- Runtime status: callable (bounded-browser-lane)
- Proof path: `C:\Users\User\.openclaw\workspace\directive-workspace\runtime\records\2026-03-21-puppeteer-runtime-slice-01-proof.md`
- Last validated by: `npm run check:ops-stack`
- Last validation date: 2026-03-21
- Active risks: smoke confidence depends on selector coverage and current host route stability; lane remains intentionally non-destructive.
- Rollback path: use rollback section in promotion record and restore pack classification to `follow_up_only` if browser-lane health drifts.
- Notes: callable status is bounded to Mission Control dashboard smoke validation and does not imply generic website automation ownership.
