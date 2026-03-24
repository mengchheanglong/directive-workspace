# Adopted / Planned-Next: scientify Slice 6 (2026-03-19)

## decision
- **Adopt (planned-next)** for extracted mechanisms only.
- Do **not** adopt scientify runtime stack directly into Mission Control.

## pinned source
- Path: `C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\scientify`
- Commit: `921d510b06be8ccdb4ef04a202244c9be7ac4367`
- Describe: `v1.12.0-2-g921d510`

## adopted extracted patterns
1. Promotion quality-gate triplet with explicit fail-reason strings:
- full-text coverage threshold
- evidence-binding threshold
- citation-error threshold

2. Deterministic downgrade policy:
- quality-sensitive runs downgrade to `degraded_quality` when gate fails.

3. Validation-state taxonomy with optional external validation loop:
- include explicit outcomes (`openreview_related`, `openreview_not_found`) and optional validation evidence before promotion.

4. Standardized rendered quality telemetry:
- include pass/fail plus quality metric percentages in decision/proof artifacts.

## rationale
- Slice 6 bounded proof passed all target checks:
  - threshold constants present
  - explicit failure reasons present
  - downgrade path present
  - validation states present
  - quality summary rendering present
  - optional external validation step present
- Mission Control required gates passed after infra-fix rerun, including `check:ops-stack`.
- This increases promotion/handoff quality control without API contract changes.

## planned-next
1. Add a Directive policy template for `promotion_quality_gate` with threshold fields and fail-reason capture.
2. Add `degraded_quality` handling guidance to promotion contract checklists for reviewer/operator workflows.
3. Add a lightweight checker proposal to ensure promotion artifacts include quality metrics and validation-state evidence when applicable.

## rollback
- Delete this adopted note and corresponding execution note.
- Remove Slice 6 entry from day closure artifact.
- No runtime rollback required (no runtime integration performed).

## implementation status update (2026-03-20)

Planned-next is now materialized via:
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\promotion-quality-gate.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\05-reference-patterns\2026-03-20-promotion-quality-gate-contract.md`
- `C:\Users\User\.openclaw\workspace\mission-control\scripts\check-directive-promotion-quality-contracts.ts`

Gate wiring:
- `npm run check:directive-promotion-quality-contracts`
- `npm run check:ops-stack`

Status:
- `completed_for_current_scope` (contract/template/check enforcement delivered; no new runtime lane change introduced).
