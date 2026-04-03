# Runtime Follow-up Archive

This folder stores superseded Runtime follow-up artifacts that are no longer part of the active follow-up corpus.

Archive rule:
- move an artifact here only after repo-local proof shows it has no active direct references from checkers, promotion surfaces, or operator-start surfaces
- do not treat this folder as a live continuation surface
- if a missed active reference appears, roll the artifact back into `runtime/follow-up/`

Use the canonical shared resolver for live continuation truth:
- `shared/lib/dw-state.ts`
- `npm run report:directive-workspace-state`
