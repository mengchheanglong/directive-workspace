# Active Runbook

## Run purpose

This is the active runbook for autonomous work inside `directive-workspace/`.

Before doing substantive work, the agent must:
1. read `CLAUDE.md`
2. read `AGENTS.md`
3. read `implement.md`
4. read `control/README.md`
5. refresh current repo truth from code and records
6. then proceed in bounded verified cycles

This runbook works with the other `control/` surfaces:
- `control/runbook/current-priority.md` for current mission focus and run priority
- `control/policies/stop-lines.md` for active execution guardrails
- `control/policies/continuation-rules.md` for task selection and continuation rules
- `control/policies/logging-rules.md` for logging and handoff rules

Historical logs do not belong here. They belong under `control/logs/`.

## Scope for this run

In scope:
- bounded, reversible, measurable changes
- Engine-aligned improvements
- Discovery / Runtime / Architecture workflow improvements
- stronger workflow truth, proof, reporting, and integration discipline
- checks, validation, and targeted verification
- code / docs / records alignment when grounded in actual repo truth

Out of scope:
- broad speculative redesign
- cosmetic cleanup
- generic framework expansion without workflow pressure
- unrelated cleanup across multiple layers
- reopening intentionally parked work without strong repo-truth justification
- bundling several separate improvements into one cycle

## Repo-specific constraints

The agent must preserve these truths while working:

- Directive Workspace is the product
- Engine is the shared adaptation core inside it
- Discovery is goal-aware intake, filtering, and routing
- Runtime is reusable runtime usefulness conversion and behavior-preserving transformation
- Architecture is Engine self-improvement / operating code
- do not collapse Engine into Architecture
- do not reduce Directive Workspace to repo intake only
- do not reduce Runtime to tool adoption only
- do not reduce Architecture to passive notes
- do not drop Decide or Report from the workflow
- keep changes reversible, measurable, and architecture-first

If work touches doctrine-sensitive areas, prefer the smallest change that increases real operating value.

## Instruction priority

When instructions conflict, use this order:
1. direct user instruction in the current session
2. `directive-workspace/CLAUDE.md`
3. `directive-workspace/AGENTS.md`
4. `control/runbook/active.md`
5. nearest local docs for the touched area
6. code truth and established repo patterns

If uncertainty remains, inspect more before changing code.

## Verification rules

Never claim success without evidence.

Use the strongest practical verification available for the touched area, preferring:
1. targeted checks for the changed behavior
2. existing workflow checks / reports
3. targeted tests
4. broader repo checks if needed

Prefer targeted verification before broad noisy validation.

If relevant, use commands like:

```bash
npm run check
npm run report:directive-workspace-state
```

If the touched area has its own targeted check or report script, use that first.

If no adequate verification exists and the change truly needs it, add minimal focused verification rather than broad test scaffolding.

If verification fails:
- fix the bounded slice if practical
- otherwise stop honestly at the failed boundary and record the issue clearly

## Change discipline

Keep edits:
- minimal
- coherent
- reversible
- evidence-based

Rules:
- do not silently redesign adjacent systems
- do not broaden scope just because a nearby cleanup is tempting
- do not make records claim more than code truth supports
- do not move parked work unless clearly justified by current repo truth
- do not treat partial work as completed work
- do not create doctrine drift between code, records, and handoff files

When touching records, reports, or handoff files, ensure they reflect actual implementation truth.
