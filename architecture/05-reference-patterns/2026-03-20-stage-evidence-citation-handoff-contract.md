# Stage/Evidence/Citation Handoff Contract

Status: retired (2026-03-22)
Absorbed by: `shared/schemas/analysis-evidence-artifact.schema.json`, `shared/schemas/citation-set-artifact.schema.json`, `shared/schemas/evaluation-support-artifact.schema.json`, and the stage-handoff schemas in `shared/schemas/`
Retirement reason: All substantive value (artifact type definitions, minimum required fields, handoff chain) is now represented in the shared schemas with machine-readable enforcement. This reference pattern adds no value beyond the shared schemas.

Date: 2026-03-20
Track: Directive Architecture
Source synthesis:
- PaperCoder stage-contract pattern (`dw-src-papercoder-paper`)
- Karpathy loop discipline (`dw-src-karpathy-autoresearch`)
- RAG evidence/citation pattern (`dw-src-rag-architecture`)

## Purpose

Define one merged handoff contract for lifecycle stage transitions and evidence quality control, without creating runtime dependency on any external stack.

## Canonical Handoff Chain

1. `IntakeNormalizedArtifact`
2. `AnalysisPlanArtifact`
3. `ExperimentDesignArtifact`
4. `IntegrationContractArtifact`
5. `ProofChecklistArtifact`

Supporting artifacts:
- `AnalysisEvidenceArtifact`
- `CitationSetArtifact`
- `EvaluationSupportArtifact`

## Minimum Required Fields

### IntakeNormalizedArtifact

- `capability_id`
- `source_type`
- `source_ref`
- `normalization_status`
- `normalized_payload`

### AnalysisPlanArtifact

- `capability_id`
- `analysis_hypothesis`
- `stage_plan`
- `decision_criteria`
- `risk_notes`

### ExperimentDesignArtifact

- `capability_id`
- `bounded_scope`
- `validation_commands`
- `rollback_plan`
- `expected_outputs`

### IntegrationContractArtifact

- `capability_id`
- `adoption_target`
- `integration_mode`
- `required_gates`
- `owner`

### ProofChecklistArtifact

- `capability_id`
- `required_proof_items`
- `gate_snapshot`
- `pass_fail_summary`
- `rollback_verification`

### AnalysisEvidenceArtifact

- `capability_id`
- `evidence_items[]`
- `collection_status` (`complete|partial|empty`)
- `errors[]`

### CitationSetArtifact

- `capability_id`
- `citations[]`
- `reference_section_markdown`
- `coverage_status` (`complete|partial|missing`)
- citation URL validity: `http/https` only
- citation dedupe: normalized URL identity

### EvaluationSupportArtifact

- `capability_id`
- `source_urls[]`
- `visited_urls[]`
- `research_costs`
- `quality_signals`

## Handoff Rules

1. Stage handoff is invalid if the upstream required fields are missing.
2. Evidence may degrade to `partial`, but handoff must preserve explicit `errors[]`.
3. Citation coverage may degrade to `partial`; missing citations require explicit `coverage_status=missing`.
4. Integration/proof stages cannot claim success without gate snapshot and rollback verification fields.
5. If `collection_status=empty` and no explicit blocker exists, handoff must fail-closed.

## Fallback Policy

- Allowed fallback:
  - parse normalization fallback for structured-but-noisy outputs
  - citation synthesis from visited URLs when citation map is missing
  - citation URL normalization + dedupe before synthesis
  - partial evidence pass-through with explicit status
- Disallowed fallback:
  - silent field dropping
  - implicit success state when required proof fields are absent
  - runtime/callable promotion without contract + proof artifacts

## Validation Hooks

- Architecture contract health:
- `npm run check:directive-forge-records`
- `npm run check:directive-integration-artifact-templates`
- `npm run check:directive-citation-contracts`
- System-wide guard:
  - `npm run check:ops-stack`

## Adoption Boundary

- This artifact is Architecture-only contract guidance.
- Runtime/callable follow-up remains Forge-owned and requires separate promotion records.
