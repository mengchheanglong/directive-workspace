# Cycle Entry

Cycle 5

Chosen task:

Refactor `check:control-authority` so it exposes a machine-readable failure contract and verify one bounded failure-path probe.

Why it won:

`check:control-authority` was the cleanest current pilot member because its invariants are local, text-based, and can be failed safely in-memory without mutating repo truth.

Affected layer:

One repo validation checker plus one focused failure-contract probe.

Owning lane:

Architecture.

Mission usefulness:

Creates a real machine-readable failure surface for one existing checker so later pilot-level failure validation can rely on something explicit instead of inferring failure from raw assertion text.

Proof path:

Refactor the checker to return structured success/failure JSON, preserve the existing success facts, add one safe in-memory probe that proves `ok: false` plus stable violation metadata, then rerun state and repo checks.

Rollback path:

Restore the old assert-only checker behavior, remove the focused failure-contract probe script and package entry, and delete this cycle log.

Stop-line:

Stop after `check:control-authority` exposes an explicit machine-readable failure contract, one safe failure-path probe proves it, and main repo checks still pass.

Files touched:

- `scripts/check-control-authority.ts`
- `scripts/check-control-authority-failure-contract.ts`
- `package.json`
- `control/logs/2026-03/2026-03-30-control-authority-failure-contract.md`

Verification run:

- `npm run check:control-authority`
- `npm run check:control-authority-failure-contract`
- `npm run report:directive-workspace-state`
- `npm run check`

Result:

`check:control-authority` now emits a stable success/failure JSON union with `checkerId`, `failureContractVersion`, and structured violations on failure. The bounded probe proves the checker exits non-zero and emits `missing_required_content` for `implement.md` without altering repo files.

Next likely move:

If the next slice is justified, adapt the checker-definition pilot so the `control_authority` entry can validate this explicit failure contract before touching the other two pilot members.

Risks / notes:

- This is intentionally checker-local and does not impose a generic failure framework on other checkers yet.
- No additional pilot members or frozen-lane work were opened.
