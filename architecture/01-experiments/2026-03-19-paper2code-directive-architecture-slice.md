# Paper2Code Directive Architecture Slice (2026-03-19)

## lane + scope lock
- Lane: `Directive Architecture (v1)` only.
- Slice type: bounded reverse-engineering and contract extraction.
- Explicitly out of scope: callable runtime integration, API changes, external repo runtime adoption.

## candidate pin verification
- Candidate path: `C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\Paper2Code`
- `git rev-parse HEAD`: `e044e3b10e3e71f66b6fb54d15cfdc2f4e44c201`
- `git describe --tags --always --dirty`: `e044e3b`
- `git status --porcelain`: clean (no output)

## bounded proof definition
- Timebox: 60 minutes static analysis only.
- Success criteria:
  1. Extract explicit stage contracts for `0_pdf_process.py`, `1_planning.py`, `2_analyzing.py`, `3_coding.py`.
  2. Map stages to Directive lifecycle (`intake -> analysis -> experiment design -> integration/proof`).
  3. Propose typed artifact schema suitable for later Directive Workspace implementation.
  4. Record excluded baggage and rollback-safe boundary.

## static evidence used
- Stage runner contract references in `scripts/run.sh` and `scripts/run_llm.sh`.
- File IO and guard checks in:
  - `codes/0_pdf_process.py`
  - `codes/1_planning.py`
  - `codes/2_analyzing.py`
  - `codes/3_coding.py`
  - support bridge: `codes/1.1_extract_config.py`, `codes/utils.py`
- Evidence command:
  - `rg -n "planning_trajectories|planning_config|task_list|output_repo_dir|open\\(|json\\.dump|sys\\.exit|os\\.path\\.exists|content_to_json|extract_code_from_content|output_json_path|input_json_path" ...`

## extracted stage-contract model

| Stage file | Input artifact type | Output artifact type | Handoff contract | Failure/fallback behavior |
|---|---|---|---|---|
| `codes/0_pdf_process.py` | `PaperJsonRaw` (S2ORC-like JSON path via `--input_json_path`) | `PaperJsonNormalized` (cleaned JSON at `--output_json_path`) | Removes noisy fields (`cite_spans`, `ref_spans`, `eq_spans`, metadata keys) and writes normalized JSON consumed by later stages through runner path variables | No internal retry. Invalid path/JSON raises Python exception and stops process. |
| `codes/1_planning.py` | `PaperJsonNormalized` or `PaperLatexNormalized` + model/runtime config (`--gpt_version`, `OPENAI_API_KEY`) | `PlanningBundle`: `planning_response.json`, `planning_trajectories.json`, `accumulated_cost.json` | Produces 4-turn planning sequence (plan, design, logic-task list, config generation). Downstream expects `planning_trajectories.json` structure with assistant turns. | Guard: invalid `paper_format` -> `sys.exit(0)`. No in-file retry for API/runtime failures. |
| `codes/2_analyzing.py` | `PlanningBundle` + `planning_config.yaml` (+ optional `task_list.json`) | `AnalysisBundle`: per-file `*_simple_analysis_response.json`, `*_simple_analysis_trajectories.json`, `analyzing_artifacts/*.txt` | Extracts task list/logic analysis from planning outputs, then generates per-target-file analysis artifacts used by coding stage. | Guard: missing/invalid Task list or Logic Analysis -> `sys.exit(0)`. Fallback parsers in `utils.content_to_json*` handle malformed JSON-ish `[CONTENT]` output and key casing variants (`Task list`/`task_list`/`task list`). |
| `codes/3_coding.py` | `AnalysisBundle` + `PlanningBundle` + `planning_config.yaml` | `ImplementationDraftBundle`: generated repo files under `--output_repo_dir` + `coding_artifacts/*.txt` | Iterates `Task list`, loads each prior analysis response, generates code, and writes per-file artifacts plus assembled repo. | Guard: invalid `paper_format` -> `sys.exit(0)`. Code extraction fallback is weak in OpenAI path (empty extraction falls back to raw content write); stronger fallback exists in nearest equivalent `3_coding_llm.py` (`extract_code_from_content` -> `extract_code_from_content2`). |

## Directive lifecycle mapping (v1 architecture)

| Directive lifecycle phase | Paper2Code source stage | Proposed Directive artifact | Why this mapping fits |
|---|---|---|---|
| `intake` | `0_pdf_process.py` | `IntakeNormalizedArtifact` | Normalizes heterogeneous source payload into stable, reduced noise artifact before reasoning. |
| `analysis` | `1_planning.py` | `AnalysisPlanArtifact` | Converts source content into explicit reproduction/architecture plan with tracked trajectories. |
| `experiment design` | `2_analyzing.py` | `ExperimentDesignArtifact` | Expands high-level plan into file/task-level dependency and execution-ready analysis units. |
| `integration/proof` | `3_coding.py` (adapted pattern, not direct runtime use) | `IntegrationContractArtifact` + `ProofChecklistArtifact` | Reuse the staged handoff concept to produce implementation contracts and proof obligations, not direct external code emission in Directive Architecture lane. |

## proposed typed artifact schema (for later Directive Workspace implementation)
```yaml
artifact_schema_version: "directive.stage-contract.v1"
artifacts:
  - type: IntakeNormalizedArtifact
    required:
      - capability_id
      - source_type
      - source_ref
      - normalized_payload_path
      - normalization_ruleset
      - created_at
  - type: AnalysisPlanArtifact
    required:
      - capability_id
      - plan_summary
      - assumptions
      - open_questions
      - trajectory_ref
      - model_context
  - type: ExperimentDesignArtifact
    required:
      - capability_id
      - experiment_steps
      - dependencies
      - success_criteria
      - bounded_timebox_minutes
      - risk_notes
      - rollback_plan
  - type: IntegrationContractArtifact
    required:
      - capability_id
      - integration_mode
      - target_surface
      - owner
      - required_gates
      - excluded_baggage
      - contract_status
  - type: ProofChecklistArtifact
    required:
      - capability_id
      - gate_results
      - evidence_refs
      - verdict
      - decided_at
```

## excluded baggage (do not adopt from source repo)
- Runtime stack and dependency burden: `openai`, `vllm`, `transformers`, GPU/tensor-parallel assumptions.
- End-to-end paper-to-code generation runtime behavior.
- Dataset/benchmark harness (`data/paper2code`, scoring pipeline).
- Cost accounting/log formats tied to external model usage.
- Shell runners as operational truth (`scripts/run*.sh`) for Mission Control.

## integration cost/risk/rollback (architecture lane)
- Integration cost: low-medium (schema and stage-contract modeling only).
- Main risk: overfitting Directive artifacts to one source's prompt/output conventions.
- Mitigation: keep schema typed and source-agnostic; keep parser/fallback logic modular.
- Rollback: delete this artifact and remove queued implementation slices; no runtime changes performed.

## slice decision
- Decision: `adopt` (pattern-level only).
- Adoption target: stage-contract artifact model and fallback-aware handoff validation pattern.
- Not adopted: Paper2Code runtime, dependencies, benchmark stack, or generated repository outputs.

## next implementation slices (proposal only)
1. Add a schema-only validator for `IntakeNormalizedArtifact -> AnalysisPlanArtifact` handoff in Directive Workspace checks.
2. Add fallback parser policy for structured-but-noisy JSON outputs (modeled after `content_to_json*` chain, but stricter and typed).
3. Add integration/proof contract template generation from `ExperimentDesignArtifact` without runtime callable changes.
