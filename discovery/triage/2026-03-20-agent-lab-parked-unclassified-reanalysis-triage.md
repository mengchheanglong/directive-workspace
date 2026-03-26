# Discovery Triage: Agent-Lab Parked + Unclassified Reanalysis

Date: 2026-03-20
Owner: Directive Discovery
Scope: first-pass triage only (no deep integration)

## Triage Table

| Candidate id | First-pass summary | Routing recommendation | Proposed adoption target | Suggested decision state | Fit | Reusability | Risk | Cost | Gate-safe validation |
|---|---|---|---|---|---|---|---|---|---|
| `al-parked-autoresearch` | Useful autonomous-loop discipline already partly extracted; needs delta-only review under current Doctrine | route for focused Architecture+Runtime re-analysis | Architecture + Runtime follow-up | experiment | high | high | medium | medium | yes |
| `al-parked-celtrix` | Scaffolding/checklist value is discovery-facing and architecture-friendly; runtime value is secondary | route to Discovery/Architecture rule hardening | Discovery + Architecture | experiment | medium-high | medium-high | low | low-medium | yes |
| `al-parked-cli-anything` | Command mediation remains interesting but safety/abuse surface is non-trivial | route to Runtime with strict guardrail-first scope | Runtime | defer-to-experiment | medium | medium | high | medium | yes (bounded) |
| `al-parked-codegraphcontext` | Context graph extraction aligns with Architecture quality work; runtime import not needed | route to Architecture patterns lane | Architecture | experiment | high | medium-high | medium | medium | yes |
| `al-parked-desloppify` | Small, practical quality utility with clear operational value | route to Runtime utility hardening | Runtime | accept-for-runtime-follow-up | high | high | low | low | yes |
| `al-parked-hermes-agent` | Strong contract ideas, but complexity needs bounded extraction only | route to Architecture contract refinement + optional Runtime utility follow-up | Architecture (+ Runtime follow-up) | experiment | medium-high | high | medium | medium | yes |
| `al-parked-impeccable` | Guardrail/frontend quality patterns remain useful as design policy | route to Architecture policy set | Architecture | accept-for-architecture | medium-high | medium-high | low-medium | low-medium | yes |
| `al-unclassified-plane` | Boundary rule source; valuable as governance pattern, not runtime target | route to Discovery governance docs and Architecture boundary model | Discovery + Architecture | knowledge-only -> monitor | medium | medium | low | low | yes |

## Immediate Risks

- Re-analyzing already-extracted candidates can create duplicate records if not tracked as delta passes.
- CLI mediation candidates can drift into runtime scope too early.
- Unclassified sources can become noise if not tied to explicit adoption targets.

## Missing Evidence (for deep pass)

- delta-vs-existing extraction gap per candidate
- explicit “new value” statement versus current ledger entries
- bounded validation design for candidates with runtime implications

## Next Action

Create routing records and a re-analysis queue with explicit order and bounded scope.

Linked intake record:
- `C:\Users\User\.openclaw\workspace\directive-workspace\discovery\intake\2026-03-20-agent-lab-parked-unclassified-reanalysis-intake.md`
