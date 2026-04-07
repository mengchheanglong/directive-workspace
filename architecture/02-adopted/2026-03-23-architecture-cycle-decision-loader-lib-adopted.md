# Architecture Cycle Decision Loader Lib Adopted

- Date: 2026-03-23
- Usefulness level: meta
- Artifact type: shared-lib
- Artifact path: `shared/lib/architecture-cycle-decision-loader.ts`

## Adopted value

Directive Workspace can now evaluate an Architecture wave from the wave's own record refs.

The system no longer has to hand-maintain a separate list of decision JSON paths to get machine-readable verdict composition.

## Proof surface

- Mission Control host script: `scripts/evaluate-directive-architecture-wave.ts`
- Checker: `scripts/check-directive-architecture-wave-evaluation.ts`
