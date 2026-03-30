# Runtime Promotion Records

This folder holds host-facing promotion contracts for Runtime candidates.

Use:
- `shared/templates/promotion-record.md`
- `shared/contracts/runtime-to-host.md`
- `runtime/PROMOTION_PROFILES.json`

Create a promotion record when a Runtime runtime slice is ready to propose host activation or host-owned integration work.

Do not mark a candidate as accepted runtime state until the linked host gates and proof are explicit.

Rule:
- `Quality gate profile` selects the canonical promotion profile.
- `Promotion profile family`, `Proof shape`, and `Primary host checker` must match the selected entry in `PROMOTION_PROFILES.json`.

Current backlog:
- `runtime/promotion-records/2026-03-20-runtime-promotion-backlog.md`
