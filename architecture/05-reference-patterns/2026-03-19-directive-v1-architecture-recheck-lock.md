# Directive Architecture Re-check Lock (2026-03-19)

Status: `LOCKED`

This file is the canonical lock record for the 2026-03-19 v1 Architecture re-check outcome.
Use this as the default baseline for subsequent planning and experiments.

## canonical sources
- `../04-deferred-or-rejected/2026-03-19-recheck-deferred-rejected-v2.md`
- `../02-experiments/2026-03-19-remaining-candidates-execution-plan.md`
- `./2026-03-19-future-candidates-agency-agents-arscontexta.md` (parked future candidates)

## locked decisions

| Candidate | Locked status |
|---|---|
| Paper2Code | `promote_to_queue` |
| gpt-researcher | `promote_to_queue` |
| swe-agent | `defer_monitor` |
| autoresearchclaw | `defer_monitor` |
| autogen | `defer_monitor` |
| openhands | `defer_monitor` |
| minimal-agent-tutorial | `still_reject` |
| codescientist | `still_reject` |
| AI-Scientist | `still_reject` |
| DeepCode | `still_reject` |

## operating boundary
- v1 Architecture decisions are reverse-engineering/pattern-extraction decisions.
- They are not runtime-callable adoption decisions.
- Runtime-callable promotion remains in Directive Forge lane.

## unlock protocol
A later re-check may supersede this lock only if it:
1. Creates a new dated lock or re-check artifact.
2. Includes a clear delta table (`old -> new`) with rationale.
3. Preserves v1 Architecture boundary (no silent runtime-lane mixing).
