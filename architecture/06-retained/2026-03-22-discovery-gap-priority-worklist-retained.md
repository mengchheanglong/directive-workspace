# Retained Architecture Output: Discovery Gap Priority Worklist (2026-03-29)

## retained objective
- Candidate id: `dw-discovery-gap-driven-priority-loop`
- Candidate name: Discovery Gap Priority Worklist
- Source implementation result: `architecture/05-implementation-results/2026-03-22-discovery-gap-priority-worklist-implementation-result.md`
- Source implementation target: `architecture/04-implementation-targets/2026-03-22-discovery-gap-priority-worklist-implementation-target.md`
- Source adoption artifact: `architecture/03-adopted/2026-03-22-discovery-gap-priority-worklist-adopted.md`
- Source bounded result artifact: ``
- Objective retained: Materialize one read-only Discovery selection helper that consumes the canonical gap worklist and returns the top eligible gap to work next without re-implementing ranking logic in downstream consumers.

## final usefulness assessment
- Usefulness level: `meta`
- Assessment: The selector is worth retaining because it exposes one explicit, read-only Discovery-owned selection boundary over the canonical gap worklist without changing scoring, generation, or queue/routing state.

## retained review resolution
- Review score: `5`
- Review result: `approved`
- Lifecycle outcome: `promote_to_decision`
- Transition request: `evaluated -> decided` via `decision_owner`

### warning checks
- none

### failing checks
- none

### required changes
- none

## stability and reuse
- Stability level: `bounded-stable`
- Reuse scope: Retain for Directive Workspace Discovery and Architecture consumers that need the current top eligible open gap without re-implementing worklist traversal or mutating canonical artifacts.

## evidence links
- Actual implementation result summary: Added one read-only shared selector that reads the canonical discovery gap worklist and returns the top eligible open gap with its preserved selection fields, without mutating queue, routing, or worklist state.
- Implementation result artifact: `architecture/05-implementation-results/2026-03-22-discovery-gap-priority-worklist-implementation-result.md`
- Implementation target artifact: `architecture/04-implementation-targets/2026-03-22-discovery-gap-priority-worklist-implementation-target.md`
- Adoption artifact: `architecture/03-adopted/2026-03-22-discovery-gap-priority-worklist-adopted.md`
- Upstream bounded result artifact: ``

## confirmation decision
- Confirmation approval: `directive-lead-implementer`
- Decision: Retain this implementation result as the canonical bounded selector for top-eligible Discovery gap selection within the current engine-improvement boundary.

## rollback boundary
- If the selector boundary proves misleading or too narrow, return to the implementation result or implementation target, remove the retained artifact, and reopen one bounded Architecture slice instead of widening behavior by momentum.

## artifact linkage
- This retained Architecture output is now recorded at `architecture/06-retained/2026-03-22-discovery-gap-priority-worklist-retained.md`.
- If retention later proves premature, resume from `architecture/05-implementation-results/2026-03-22-discovery-gap-priority-worklist-implementation-result.md` or `architecture/04-implementation-targets/2026-03-22-discovery-gap-priority-worklist-implementation-target.md` instead of reconstructing the chain by hand.
