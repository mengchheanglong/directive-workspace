# Adopted / Planned-Next: gh-aw Slice 4 (2026-03-19)

## decision
- **Adopt** (planned-next), with strict scope:
  - adopt extracted architecture patterns only
  - do not import gh-aw runtime/framework into mission-control

## pinned source
- Path: `C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\gh-aw`
- Commit: `3a35d272bcf0b69b78ab83e42be9c667caa043aa`
- Describe: `v0.61.0-23-g3a35d272b`

## extracted pattern set
1. Read-only agent lane + separate write lane via safe outputs.
2. Compile-time lock artifact as execution contract (markdown intent is source-of-intent only).
3. Sanitization and constrained write operations as mandatory policy surface.
4. Tracker/workflow identifiers for auditability and cleanup lifecycle.

## rationale (evidence-backed)
- Static proof on `daily-safe-outputs-conformance` markdown/lock pair passed all checks:
  - safe-outputs present
  - read-only agent permissions present
  - write scope isolated to controlled path
  - sanitize flags present in compiled config
- This directly improves Directive Workspace promotion contract and observability without runtime destabilization.

## planned-next
1. Add a lightweight checker in architecture-lab/mission-control policy checks to enforce read-only-agent/write-lane split for directive automation specs.
2. Add a promotion-contract field template for `compile_contract_artifact` (source intent vs compiled runtime artifact).
3. Revisit full gh-aw runtime only if a dedicated isolated runtime lane is requested.

## rollback
- Delete this adopted note and corresponding execution note.
- Remove queue update section from day closure note.
- No runtime rollback required (no mission-control runtime integration done).

## implementation status update (2026-03-21)

Planned-next is now materialized via:
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\automation-lane-split.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\05-reference-patterns\2026-03-21-gh-aw-lane-split-contract-policy.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\promotion-contract.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\templates\promotion-record.md`
- `C:\Users\User\.openclaw\workspace\mission-control\scripts\check-directive-gh-aw-contracts.ts`

Gate wiring:
- `npm run check:directive-gh-aw-contracts`
- `npm run check:ops-stack`

Status:
- `completed_for_current_scope` (gh-aw planned-next contract closure delivered with host checker enforcement; no runtime lane expansion).
- Global `check:ops-stack` remains affected by pre-existing nightly/repo-source health failures outside gh-aw slice scope.
