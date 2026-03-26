# Discovery Fast Path: Workspace Readiness Check Transformation

- Candidate id: `dw-transform-workspace-readiness-check-consolidation`
- Candidate name: `Workspace Readiness Check Consolidation`
- Date: `2026-03-22`
- Source type: `internal-signal`
- Source reference: `mission-control/src/server/services/workspace-intel-service.ts`
- Mission alignment: `Mission Control as unified runtime host and agent command surface - keep project-readiness evaluation clearer and easier to evolve without changing readiness behavior`
- Capability gap id: `gap-transformation-lane`

## Usefulness Judgment

This is a valid Runtime transformation candidate.

Useful value:
- preserves the same workspace-readiness behavior while reducing the size of a high-leverage host evaluator
- makes it easier to evolve collaboration/readiness signals without keeping signal collection, check construction, and score summarization inline in one function
- strengthens the doctrine that Runtime should handle behavior-preserving transformations on mission-relevant host surfaces, not only new runtime adoption

## Routing Decision

- Primary adoption target: `Directive Runtime`
- Route reason: `behavior-preserving maintainability transformation on a mission-relevant runtime-host surface`

## Bounded Claim

Extract recent-report detection, required-context-file verification, readiness-doc signal collection, readiness-check construction, and score summarization out of `buildWorkspaceReadiness` without changing:
- `WorkspaceReadiness` shape
- readiness thresholds
- readiness-check labels, details, or href targets
- the underlying doc/quest/report/context-file rules

## Proof Boundary Notes

- keep the change inside `workspace-intel-service.ts`
- do not change repository interfaces or `WorkspaceReadiness` types
- validate with host-safe checks only

## Result Link

- Runtime record: `runtime/records/2026-03-22-workspace-readiness-check-transformation-record.md`
