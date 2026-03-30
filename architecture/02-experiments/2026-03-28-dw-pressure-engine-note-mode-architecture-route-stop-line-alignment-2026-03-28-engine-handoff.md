# Engine NOTE-Mode Architecture Route Stop-Line Alignment Engine-Routed Architecture Experiment

Date: 2026-03-28
Track: Architecture
Type: engine-routed handoff
Status: pending_review

## Source

- Candidate id: `dw-pressure-engine-note-mode-architecture-route-stop-line-alignment-2026-03-28`
- Source reference: `shared/lib/dw-state.ts`
- Discovery routing proof case 1: `discovery/routing-log/2026-03-28-dw-source-inspect-ai-2026-03-28-routing-record.md`
- Discovery routing proof case 2: `discovery/routing-log/2026-03-28-dw-source-openevals-2026-03-28-routing-record.md`
- Discovery routing proof case 3: `discovery/routing-log/2026-03-28-dw-source-promptwizard-2026-03-28-routing-record.md`
- Architecture handoff proof case 1: `architecture/02-experiments/2026-03-28-dw-source-inspect-ai-2026-03-28-engine-handoff.md`
- Architecture handoff proof case 2: `architecture/02-experiments/2026-03-28-dw-source-openevals-2026-03-28-engine-handoff.md`
- Architecture handoff proof case 3: `architecture/02-experiments/2026-03-28-dw-source-promptwizard-2026-03-28-engine-handoff.md`
- Primary truth surface: `shared/lib/dw-state.ts`
- Focused composition checker: `scripts/check-directive-workspace-composition.ts`
- Usefulness level: `meta`
- Usefulness rationale: Meta-usefulness: Discovery-routed Architecture cases in NOTE mode currently inherit STANDARD-style bounded-start wording even though doctrine says NOTE-mode Architecture should stop at handoff plus one bounded result.

## Objective

Open one bounded DEEP Architecture slice that aligns NOTE-mode Architecture route and handoff truth with the real stop-line: handoff review plus one bounded result, with no bounded start required.

## Bounded scope

- Keep this to NOTE-mode Architecture cases only.
- Correct the shared route/contract wording for Discovery routes that land in Architecture with `operatingMode = note`.
- Correct the shared Architecture handoff wording for the same NOTE-mode class.
- Add focused proof-case verification for Inspect AI, OpenEvals, and PromptWizard.
- Do not redesign Runtime semantics, STANDARD or DEEP Architecture progression, or the broader Architecture chain.

## Inputs

- `shared/lib/dw-state.ts` currently hardcodes Architecture handoff next-step wording as `Explicitly approve the bounded Architecture start.`
- The same resolver currently advertises `Explicitly approve the bounded Architecture handoff/start boundary.` for Discovery routes into Architecture.
- Inspect AI, OpenEvals, and PromptWizard are all Discovery-routed Architecture cases with `operatingMode = note`.
- Directive Workspace doctrine says NOTE-mode Architecture is `Handoff -> single bounded-result with verdict noted. No bounded-start needed.`

## Validation gate(s)

- `note_architecture_handoff_prefers_result_boundary`
- `note_architecture_route_prefers_result_boundary`
- `standard_architecture_boundary_preserved`
- `decision_review`

## Lifecycle classification

- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: Would this mechanism still be valuable without a runtime surface? `yes`

## Rollback

Revert the NOTE-mode handoff/route wording change in `shared/lib/dw-state.ts`, revert the focused proof-case assertions in `scripts/check-directive-workspace-composition.ts`, and delete this DEEP case chain.

## Next decision

- `adopt`
