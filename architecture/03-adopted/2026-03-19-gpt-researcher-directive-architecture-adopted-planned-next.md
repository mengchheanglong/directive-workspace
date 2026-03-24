# Adopted / Planned-Next: gpt-researcher Directive Architecture (2026-03-19)

## decision
- Final status: `adopt_planned_next`.
- Lane: `Directive Architecture (v1)` only.
- Scope: adopt extracted contract patterns (evidence/citation/report metadata + partial-result handling), not runtime stack.

## evidence basis
- Experiment artifact:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\02-experiments\2026-03-19-gpt-researcher-directive-architecture-slice.md`
- Candidate pin:
  - Path: `C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\gpt-researcher`
  - Commit: `7c321744ce336949949b1e95b4652e2d455a33f9`
  - Describe: `v3.4.3-3-g7c321744`
  - Status: clean

## extracted value approved
1. Evidence unit normalization pattern:
   - web evidence shape (`url`, `raw_content`, `image_urls`, `title`)
   - MCP evidence shape (`content`, `url`, `title`, `query`, `source_type`)
2. Citation/reference contract pattern:
   - references derived from visited URL set
   - learning-to-citation map for deeper analysis traces
3. Report/evaluation support contract pattern:
   - report output + research metadata (`source_urls`, `visited_urls`, `research_costs`, images)
4. Partial/failure handling pattern:
   - degrade to partial artifacts (`[]`, `""`, filtered `None`) while preserving forward progress.

## excluded baggage
- Runtime/backend/frontend deployment model of gpt-researcher.
- Provider/retriever runtime dependencies and API key setup.
- Websocket/transport implementation details as integration target.
- Any callable integration into Directive Forge/Mission Control runtime.

## risk + rollback
- Risks:
  - schema coupling to markdown-only assumptions;
  - false certainty if implicit quality hints are treated as explicit confidence scores.
- Rollback:
  - remove corresponding Directive architecture schema/check slices;
  - delete this adoption artifact and reopen candidate as deferred if quality model proves too implicit;
  - no runtime rollback needed.

## smallest implementation-ready slices (max 3)

### Slice 1: Analysis evidence artifact contract
- Objective:
  - add `AnalysisEvidenceArtifact` schema and validator with `complete/partial` state.
- Exact target area:
  - Directive Workspace analysis artifact schema/check layer.
- Validation command(s):
  - `npm run check:directive-v0`
  - `npm run check:directive-workspace-health`
- Rollback note:
  - remove artifact schema registration and validator bindings.

### Slice 2: Citation set contract + fallback synthesis
- Objective:
  - add `CitationSetArtifact` with dedupe/URL validation and fallback from visited URLs.
- Exact target area:
  - Directive Workspace citation/reference artifact module/spec docs.
- Validation command(s):
  - `npm run check:directive-v0`
  - `npm run check:directive-integration-proof`
- Rollback note:
  - disable synthesized citation fallback and revert to existing manual citation handling.

### Slice 3: Evaluation support metadata contract
- Objective:
  - add `EvaluationSupportArtifact` for cost/source/quality-signal metadata with explicit missing-field semantics.
- Exact target area:
  - Directive Workspace evaluation/proof support schema + health checks.
- Validation command(s):
  - `npm run check:directive-v0`
  - `npm run check:directive-workspace-health`
  - `npm run check:ops-stack`
- Rollback note:
  - remove evaluation-support schema and keep legacy metadata path.

## decision close state
- gpt-researcher queue item is closed for this decision cycle as `adopt_planned_next`.

## Normalization annotation (retroactive, 2026-03-22)

Added by corpus normalization program. This record predates the source-adaptation contracts and is exempt from retroactive rewrite per `architecture-artifact-lifecycle` contract.

### Lifecycle classification

- Origin: `source-driven` (gpt-researcher repo)
- Usefulness level: `structural` — evidence/citation/evaluation schemas improve the Directive framework's ability to handle structured research output
- Status class: `product_materialized` — three shared schemas + shared contract + host checks
- Forge threshold check: yes — the extracted contract patterns (evidence normalization, citation fallback, evaluation metadata) are valuable without a runtime surface

### Contract coverage assessment

- Source analysis: not performed (pre-doctrine). The experiment slice contains equivalent extraction evidence — the strongest in the corpus — but not structured per `source-analysis-contract`
- Adaptation decision: implicit. Excluded baggage section documents what was rejected. Adaptation delta (what changed between gpt-researcher's shapes and Directive's schemas) is inferable but not explicit
- Adoption criteria: not applied. The record's own lane-boundary reasoning functions as an equivalent
- Self-improvement evidence: n/a (structural, not meta-useful)

### Adaptation quality assessment

- Adaptation quality: `strong` — clear separation between extracted value (4 contract patterns) and excluded baggage (runtime, providers, transport). The adopted forms (schemas, contracts) are Directive-native, not upstream mirrors
- Improvement quality: `adequate` — missing-field semantics and partial/failure handling were improved beyond the original source's patterns, but the improvement delta is implicit rather than explicitly documented

## implementation status update (2026-03-20)

Slice 1 (AnalysisEvidenceArtifact contract) is materialized via:
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\schemas\analysis-evidence-artifact.schema.json`
- `C:\Users\User\.openclaw\workspace\mission-control\src\lib\directive-workspace\lifecycle-artifacts.ts`
- `C:\Users\User\.openclaw\workspace\mission-control\scripts\check-directive-architecture-schemas.ts`
- `C:\Users\User\.openclaw\workspace\mission-control\scripts\check-directive-lifecycle-artifacts.ts`

Slice 2 (CitationSetArtifact fallback synthesis + URL/dedupe guard) is materialized via:
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\citation-set-fallback.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\05-reference-patterns\2026-03-20-citation-set-fallback-policy.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\schemas\citation-set-artifact.schema.json`
- `C:\Users\User\.openclaw\workspace\mission-control\src\lib\directive-workspace\lifecycle-artifacts.ts`
- `C:\Users\User\.openclaw\workspace\mission-control\scripts\check-directive-citation-contracts.ts`

Slice 3 (EvaluationSupportArtifact metadata contract) is materialized via:
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\schemas\evaluation-support-artifact.schema.json`
- `C:\Users\User\.openclaw\workspace\mission-control\src\lib\directive-workspace\lifecycle-artifacts.ts`
- `C:\Users\User\.openclaw\workspace\mission-control\scripts\check-directive-architecture-schemas.ts`
- `C:\Users\User\.openclaw\workspace\mission-control\scripts\check-directive-workspace-health.ts`

Gate wiring:
- `npm run check:directive-citation-contracts`
- `npm run check:directive-v0`
- `npm run check:directive-integration-proof`
- `npm run check:directive-workspace-health`
- `npm run check:ops-stack`

Status:
- `completed_for_current_scope` (all three planned-next slices are now materialized).
