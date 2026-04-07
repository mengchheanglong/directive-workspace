# 2026-04-06 Architecture Reference-Pattern Surface Removal

## Slice

- Affected layer: Architecture artifact tree and active contract/schema surface
- Owning lane: Architecture
- Mission usefulness: remove the inactive `architecture/05-reference-patterns/` shelf so the transferable system keeps only live operating surfaces

## Removed

- `architecture/05-reference-patterns/`

## Updated Active Surfaces

- [shared/contracts/architecture-artifact-lifecycle.md](/C:/Users/User/projects/directive-workspace/shared/contracts/architecture-artifact-lifecycle.md)
- [shared/contracts/architecture-adoption-criteria.md](/C:/Users/User/projects/directive-workspace/shared/contracts/architecture-adoption-criteria.md)
- [shared/contracts/adaptation-decision-contract.md](/C:/Users/User/projects/directive-workspace/shared/contracts/adaptation-decision-contract.md)
- [shared/schemas/source-adaptation-decision.schema.json](/C:/Users/User/projects/directive-workspace/shared/schemas/source-adaptation-decision.schema.json)
- [runtime/source-packs/README.md](/C:/Users/User/projects/directive-workspace/runtime/source-packs/README.md)

The active system no longer advertises `architecture/05-reference-patterns/` as an integration surface.

## Historical Boundary

- Historical artifacts may still mention `architecture/05-reference-patterns/`.
- This slice did not rewrite the historical corpus.
- The deleted shelf is treated as intentionally retired, not as a compatibility surface to preserve.

## Proof Path

- `npm run check:control-authority`
- `npm run check:directive-workspace-composition`
- `npm run check:architecture-materialization-due-check`
- `npm run check:frontend-host`

## Rollback Path

- restore `architecture/05-reference-patterns/` from git history if needed
- revert the active contract/schema/doc files touched in this slice

## Stop Line

- no historical artifact rewrite
- no redesign of the remaining `reference-pattern` type enums in Architecture code
- this slice only removes the folder and the live surface claims around it
