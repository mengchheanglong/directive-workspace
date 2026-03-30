# Implementation Target: Discovery Gap Priority Worklist (2026-03-29)

## target
- Candidate id: `dw-discovery-gap-driven-priority-loop`
- Candidate name: Discovery Gap Priority Worklist
- Source adoption artifact: `architecture/03-adopted/2026-03-22-discovery-gap-priority-worklist-adopted.md`
- Paired adoption decision artifact: not recorded for this legacy adopted slice.
- Source bounded result artifact: not retained in this legacy adopted slice.
- Usefulness level: `meta`
- Artifact type intent: `shared-lib`
- Final adoption status: `adopted`
- Target approval: `directive-frontend-operator`

## objective (what to build)
- Build target: one Directive-owned shared library implementation slice.
- Objective retained: Materialize one read-only Discovery selection helper that consumes the canonical gap worklist and returns the top eligible gap to work next without re-implementing ranking logic in downstream consumers.
- Materialization basis: Discovery already has a checked gap-ranking surface, but the next actionable slice is still implicit in the generated artifact instead of being exposed through one explicit product-owned selector boundary.

## source decision envelope
- Decision format: `legacy_adopted_markdown`
- Source completion status: `product_materialized`
- Source verification method: `not_recorded`
- Source verification result: `not_recorded`
- Source runtime threshold check: not recorded

## source adoption resolution
- Source verdict: `adopt`
- Source readiness passed: yes
- Source Runtime handoff required: no
- Source Runtime handoff rationale: none recorded
- Source artifact path: `shared/contracts/discovery-gap-worklist.md`
- Source primary evidence path: `discovery/gap-worklist.json`
- Source self-improvement category: not recorded
- Source self-improvement verification method: `not_recorded`
- Source self-improvement verification result: `not_recorded`

### failed readiness checks
- none

## selected tactical slice
- Add one read-only shared helper that resolves the top eligible open gap from `discovery/gap-worklist.json`.
- Preserve the canonical worklist fields that explain the choice: `gap_id`, `worklist_rank`, `priority_score`, `next_slice_track`, and `next_action`.
- Keep ranking and generation in the existing canonical scorer/generator; this slice may consume them but must not duplicate or replace them.

## mechanical success criteria
- One bounded shared helper can return the same top eligible gap that the canonical `discovery/gap-worklist.json` currently ranks first among unresolved gaps.
- Focused verification proves the helper is read-only and does not mutate the queue, routing state, or worklist artifact.
- Focused verification proves the helper does not auto-open any Discovery, Architecture, or Runtime slice.

## explicit limitations
- Stay within one read-only Discovery-owned shared library slice.
- Do not change the scoring model in `shared/lib/discovery-gap-priority.ts`.
- Do not change the generator contract in `shared/lib/discovery-gap-worklist-generator.ts` unless a minimal compatibility adjustment is strictly required.
- Do not add planner wiring, queue mutation, route mutation, or automatic slice opening.

## scope (bounded)
- Keep this to one Architecture-owned implementation slice over the existing gap-worklist mechanism.
- Expose one explicit selector boundary instead of broad Discovery workflow redesign.
- Stop at the helper plus focused proof; do not broaden into UI, host, Runtime, or orchestration work.

## inputs
- Primary adopted product artifact: `shared/contracts/discovery-gap-worklist.md`
- Canonical schema: `shared/schemas/discovery-gap-worklist.schema.json`
- Canonical generated worklist: `discovery/gap-worklist.json`
- Canonical scorer: `shared/lib/discovery-gap-priority.ts`
- Canonical generator: `shared/lib/discovery-gap-worklist-generator.ts`
- Mission reference: `knowledge/active-mission.md`
- Adoption artifact: `architecture/03-adopted/2026-03-22-discovery-gap-priority-worklist-adopted.md`
- Adoption decision artifact: not recorded for this legacy adopted slice.
- Source bounded result artifact: not retained in this legacy adopted slice.

## constraints
- Preserve explicit human review before any downstream execution or host integration.
- Stay Architecture-owned only; do not hand off to Runtime from this target.
- Do not execute or mutate product code from this target artifact alone.
- Rollback boundary: Delete this implementation target and any paired implementation result, then continue from the adopted artifact if this selector boundary proves unhelpful.

## validation approach
- `decision_review`
- `worklist_selector_consistency_check`
- `discovery_boundary_preserved`
- `read_only_surface_check`
- This legacy adopted slice does not retain a bounded-result/start/run chain, so validate against the adopted artifact and retained product artifacts directly.
- Confirm the implementation target still matches the adopted artifact and retained gap-worklist mechanism.
- Confirm the target remains one bounded slice and does not imply execution automation.

## expected outcome
- One explicit Architecture implementation target that defines one Directive-owned shared library implementation slice without reconstructing the adoption chain by hand.
- No execution is triggered from this artifact.
- The new target is now retained at `architecture/04-implementation-targets/2026-03-22-discovery-gap-priority-worklist-implementation-target.md`.

