# Future Candidates Park Note (2026-03-19)

Status: `PARKED_UNTIL_CURRENT_ARCHITECTURE_SLICES_COMPLETE`

Superseded in part on 2026-03-20 by:
- `./2026-03-20-arscontexta-context-patterns.md`
- `../../forge/follow-up/2026-03-20-agency-agents-skill-pack-cutover.md`

This note preserves two candidate directions for a later Directive Architecture cycle:
- `agency-agents`
- `arscontexta`

They are intentionally postponed until current adopted work is closed.

## Why parked now
- Current priority is to finish and integrate the already adopted architecture slices:
  - Paper2Code pattern extraction output
  - gpt-researcher pattern extraction output
- Adding new candidates now would dilute implementation focus and slow closure.

## Re-open trigger (all required)
1. Paper2Code integration-ready slices are completed or explicitly deferred with rationale.
2. gpt-researcher integration-ready slices are completed or explicitly deferred with rationale.
3. Directive checks remain green after those updates:
   - `npm run check:directive-v0`
   - `npm run check:directive-integration-proof`
   - `npm run check:directive-workspace-health`
   - `npm run check:ops-stack`
4. A new dated re-check artifact is created before candidate execution starts.

## Future execution order
1. `arscontexta` (first)
   - focus: context contracts, evidence-context quality, provenance/citation support
   - expected output: `ContextContractArtifact` proposal (schema + validation + fallback)
2. `agency-agents` (second)
   - focus: orchestration contracts, role boundaries, handoff/retry/escalation policy
   - expected output: `OrchestrationContractArtifact` proposal (schema + guardrails)

## Boundary rules for future slices
- Directive Architecture lane only (reverse-engineering/pattern extraction).
- No runtime/callable integration during initial extraction slices.
- No blind framework adoption; extract mechanism-level value only.

## Next action when reopened
- Create two new bounded experiment notes in `../02-experiments/`:
  - `YYYY-MM-DD-arscontexta-directive-architecture-slice.md`
  - `YYYY-MM-DD-agency-agents-directive-architecture-slice.md`
- Then run standard gates in Mission Control.
