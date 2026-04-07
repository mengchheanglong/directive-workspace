# mini-SWE-agent Adoption Decision Envelope Source Analysis

- Source id: `dw-src-mini-swe-agent-adoption-decision-envelope-lib`
- Source type: `agent runtime utility`
- Source reference:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\mini-swe-agent\src\minisweagent\utils\serialize.py`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\mini-swe-agent\src\minisweagent\agents\default.py`
  - `C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\mini-swe-agent\docs\usage\output_files.md`
- Analysis date: `2026-03-23`
- Owning track: `Architecture`

## Mission alignment

- Active mission reference: `knowledge/active-mission.md`
- Mission relevance: Improves Directive Workspace's retained Architecture decision system by giving closeout artifacts an explicit format identity and a canonical merge discipline instead of implicit JSON shape assumptions.
- Capability gap addressed: adoption-decision artifacts were machine-readable but unversioned. The system had no executable way to distinguish future artifact-shape upgrades from the current shape, and optional nested sections were assembled ad hoc.
- Usefulness level: `meta`

## Value map

- Extractable mechanisms:
  - recursive merge that preserves nested structure while letting later sections override earlier ones
  - explicit sentinel-skipping behavior for unset fields
  - stable output format identifier carried on every retained artifact
- Value density: `high`
- Value type per mechanism:
  - `recursive merge` -> `algorithm`
  - `unset skipping` -> `algorithm`
  - `format identifier` -> `schema/runtime contract`

## Baggage map

- Implementation baggage:
  - mini-SWE-agent trajectory message structure
  - agent/model/environment serialization detail
- Stack baggage:
  - Python runtime and Pydantic agent config
  - full trajectory file persistence
- Scope baggage:
  - conversation history and run telemetry
  - mini-SWE-agent config layout
- Complexity baggage:
  - broader agent trajectory handling beyond what Directive Architecture retained decisions need

## Adaptation opportunity

- Adaptation candidates:
  - adapt recursive merge into a canonical TypeScript artifact-envelope helper for Architecture retained decisions
  - add an explicit `decision_format` to Directive adoption-decision artifacts the way mini-SWE-agent carries `trajectory_format`
  - use the helper to compose optional nested sections without leaking unset placeholders into stored JSON
- Adaptation type per candidate:
  - `artifact envelope helper` -> `reshape`, `simplify`, `recompose`
  - `decision format field` -> `extend`, `constrain`
  - `optional-section merge discipline` -> `quality`, `fit`

## Improvement opportunity

- Improvement candidates:
  - make retained Architecture artifacts migration-aware instead of assuming a single implicit shape forever
  - move artifact composition away from ad hoc optional-field filtering toward a reusable merge primitive
  - keep later closeout/backfill/wave-evaluation upgrades safer because old and new artifacts can now be distinguished explicitly
- Improvement type per candidate:
  - versioned retained decisions -> `quality`
  - reusable merge primitive -> `composability`
  - future migration safety -> `generality`

## Exclusion list

- Excluded elements:
  - mini-SWE-agent full trajectory message payloads
  - run config serialization
  - model/environment metadata
- Exclusion reason per element:
  - Directive Workspace only needs the reusable envelope mechanics, not the broader agent-run output format

## Analysis verdict

- Overall verdict: `proceed_to_extraction`
- Verdict rationale: mini-SWE-agent contains a clean executable pattern for versioned retained artifacts plus nested merge composition. That maps directly onto a real Directive Workspace Architecture gap in the live retained decision lane.
- Extraction priority: `high`
- Estimated adaptation cost: `moderate`
