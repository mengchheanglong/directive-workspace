# Cycle Entry

Cycle 4

Chosen task:

Tighten the output-contract expectations for the existing three checker-definition pilot entries.

Why it won:

The pilot was already membership-hardened, but success evidence was still too substring-oriented. The smallest truthful next move was to require exact JSON field/value checks for the three existing summaries.

Affected layer:

Shared checker-definition schema plus the bounded pilot registry and validator.

Owning lane:

Architecture.

Mission usefulness:

Makes the pilot more explicit about what each checker must actually prove in its emitted summary while staying strictly within the existing three-entry pilot.

Proof path:

Add exact JSON path/value expectations to the three pilot entries, enforce them in the validator after parsing each checker summary, then rerun the pilot and required repo checks.

Rollback path:

Remove the `requiredJsonPaths` expectations from the pilot registry, revert the schema allowance for those expectations, revert the validator parsing/enforcement logic, and delete this cycle log.

Stop-line:

Stop after one bounded output-contract refinement is enforced for the existing three pilot entries, with no fourth checker and no broader registry redesign.

Files touched:

- `shared/schemas/checker-definition-registry.schema.json`
- `scripts/checker-definition-pilot.json`
- `scripts/check-checker-definition-pilot.ts`
- `control/logs/2026-03/2026-03-30-checker-definition-output-contract-hardening.md`

Verification run:

- `npm run check:checker-definition-pilot`
- `npm run report:directive-workspace-state`
- `npm run check`

Result:

The pilot now requires each checker to satisfy both serialized marker checks and exact parsed JSON path/value checks. `check:control-authority` must prove `checked.implement` and `checked.implementSectionCount`, `check:directive-engine-stage-chaining` must prove both Architecture and Runtime control lane facts, and `check:case-planner-parity` must prove both the retained `recommend_task` case and the blocked fixture result.

Next likely move:

If another hardening slice is needed, keep it to clarifying failure-contract expectations for the same three outputs rather than changing pilot membership.

Risks / notes:

- This remains pilot-local output-contract hardening, not a generic framework abstraction.
- No fourth checker or broader checker migration was opened.
