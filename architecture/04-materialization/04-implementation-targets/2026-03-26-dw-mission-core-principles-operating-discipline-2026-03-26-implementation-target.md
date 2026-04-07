# Implementation Target: Autoresearch Core Principles for Operating Discipline (2026-03-26)

## target
- Candidate id: `dw-mission-core-principles-operating-discipline-2026-03-26`
- Candidate name: Autoresearch Core Principles for Operating Discipline
- Source adoption artifact: `architecture/02-adopted/2026-03-26-dw-mission-core-principles-operating-discipline-2026-03-26-adopted.md`
- Paired adoption decision artifact: `architecture/02-adopted/2026-03-26-dw-mission-core-principles-operating-discipline-2026-03-26-adoption-decision.json`
- Source bounded result artifact: `architecture/01-experiments/2026-03-26-dw-mission-core-principles-operating-discipline-2026-03-26-bounded-result.md`
- Usefulness level: `meta`
- Artifact type intent: `policy`
- Final adoption status: `adopted`
- Target approval: `directive-lead-implementer`

## objective (what to build)
- Build target: one Directive-owned policy implementation slice.
- Objective retained: Materialize the adapted mechanism as engine-owned product logic before any host-specific integration work.
- Materialization basis: Retained a compact Architecture policy set for mission-driven autonomous work: constrain scope intentionally, keep human strategy separate from agent tactics, require mechanical success criteria, prefer fast verification, and state limitations explicitly. This bounded slice keeps Autoresearch-specific workflow machinery out of scope and preserves only the Engine-owned operating discipline that should shape future self-improvement work. Proof used source inspection plus the linked Engine routing, handoff, and bounded-start artifacts to confirm these rules remain valuable without becoming runtime capability.

## selected tactical slice
- Carry the retained core-principles policy into the Architecture implementation chain itself.
- Make the implementation target distinguish the strategic objective from one explicitly chosen tactical slice.
- Make the implementation target and paired implementation result carry explicit mechanical success criteria and explicit limitations.

## mechanical success criteria
- The generated implementation target includes a dedicated `selected tactical slice` section.
- The generated implementation target includes a dedicated `mechanical success criteria` section with explicit bullet criteria.
- The generated implementation target includes a dedicated `explicit limitations` section.
- The paired implementation result carries the same tactical slice, success criteria, and limitations forward with an explicit recorded validation result.

## explicit limitations
- Stay within Architecture-owned operating discipline; do not open runtime execution, host integration, or Runtime work.
- Keep the slice bounded to implementation-target/result generation and reading; do not broaden into general UI redesign.
- Keep human approval and later retention or integration decisions explicit.

## scope (bounded)
- Keep this at one Architecture experiment slice.
- Preserve human review before any adoption or host integration.
- Do not execute downstream Engine changes from this stub alone.

## inputs
- Mechanical verification, constrained scope, honest limitations, and strategy-vs-tactics separation all directly improve the Engine?s mission-driven ingestion and proof-backed adoption discipline.
- Adopted artifact: `architecture/02-adopted/2026-03-26-dw-mission-core-principles-operating-discipline-2026-03-26-adopted.md`
- Adoption decision artifact: `architecture/02-adopted/2026-03-26-dw-mission-core-principles-operating-discipline-2026-03-26-adoption-decision.json`
- Source bounded result artifact: `architecture/01-experiments/2026-03-26-dw-mission-core-principles-operating-discipline-2026-03-26-bounded-result.md`
- Source bounded start artifact: `architecture/01-experiments/2026-03-26-dw-mission-core-principles-operating-discipline-2026-03-26-bounded-start.md`
- Handoff stub: `architecture/01-experiments/2026-03-26-dw-mission-core-principles-operating-discipline-2026-03-26-engine-handoff.md`
- Engine run record: `runtime/standalone-host/engine-runs/2026-03-26T02-44-01-198Z-dw-mission-core-principles-operating-discipline-2026-03-26-cfcf5c2d.json`
- Engine run report: `runtime/standalone-host/engine-runs/2026-03-26T02-44-01-198Z-dw-mission-core-principles-operating-discipline-2026-03-26-cfcf5c2d.md`
- Discovery routing record: `discovery/03-routing-log/2026-03-26-dw-mission-core-principles-operating-discipline-2026-03-26-routing-record.md`

## constraints
- Preserve explicit human review before any downstream execution or host integration.
- Stay Architecture-owned only; do not hand off to Runtime from this target.
- Do not execute or mutate product code from this target artifact alone.
- Rollback boundary: Keep the result at experiment status and do not integrate it into the engine until the adaptation boundary is clearer.

## validation approach
- `adaptation_complete`
- `engine_boundary_preserved`
- `decision_review`
- Confirm the implementation target still matches the adopted artifact and paired decision artifact.
- Confirm the target remains one bounded slice and does not imply execution automation.

## expected outcome
- One explicit Architecture implementation target that defines one Directive-owned policy implementation slice without reconstructing the adoption chain by hand.
- No execution is triggered from this artifact.
- The new target is now retained at `architecture/04-implementation-targets/2026-03-26-dw-mission-core-principles-operating-discipline-2026-03-26-implementation-target.md`.

