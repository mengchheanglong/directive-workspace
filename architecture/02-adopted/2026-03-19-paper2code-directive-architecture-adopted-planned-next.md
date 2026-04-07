# Adopted / Planned-Next: Paper2Code Directive Architecture (2026-03-19)

## decision
- Final status: `adopt_planned_next`.
- Lane: `Directive Architecture (v1)` only.
- Decision scope: adopt extracted stage-contract and artifact-schema patterns only.

## evidence basis
- Primary execution evidence:
  - `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\02-experiments\2026-03-19-paper2code-directive-architecture-slice.md`
- Source pin used in extraction:
  - Path: `C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\Paper2Code`
  - Commit: `e044e3b10e3e71f66b6fb54d15cfdc2f4e44c201`
  - Describe: `e044e3b`
  - Working tree: clean
- Extracted proof coverage from source stages:
  - `codes/0_pdf_process.py`
  - `codes/1_planning.py`
  - `codes/2_analyzing.py`
  - `codes/3_coding.py`

## extracted value approved for v1 integration
1. Stage-contract pipeline pattern with explicit handoffs:
   - `intake -> analysis -> experiment design -> integration/proof`
2. Typed artifact model proposal:
   - `IntakeNormalizedArtifact`
   - `AnalysisPlanArtifact`
   - `ExperimentDesignArtifact`
   - `IntegrationContractArtifact`
   - `ProofChecklistArtifact`
3. Fallback-aware parsing/handoff validation concept:
   - preserve forward progress when structured outputs are imperfect
   - keep contracts typed and source-agnostic

## excluded baggage (explicit non-adoption)
- Paper2Code runtime pipeline execution and shell runners.
- External runtime dependencies (`openai`, `vllm`, `transformers`, GPU/tensor-parallel assumptions).
- Paper2Code dataset/benchmark and model cost accounting stack.
- Any Mission Control callable/runtime integration from this source.

## risk + rollback
- Risk:
  - schema overfitting to one source's prompt-output conventions.
  - accidental lane drift into runtime adoption if scope is not enforced.
- Rollback:
  - revert/remove planned v1 schema/check artifacts created from this decision.
  - delete this adoption record and revert queue closure note if decision is reopened.
  - no runtime rollback required (no callable/runtime changes in this decision).

## implementation-ready planned-next slices (bounded, max 3)

### Slice 1: Stage handoff schema validator (schema-only)
- Objective:
  - enforce typed contract from intake artifact to analysis-plan artifact.
- Exact target area:
  - Directive Workspace schema/check layer (`directive-workspace` capability artifact validation checks).
- Validation command(s):
  - `npm run check:directive-v0`
  - `npm run check:directive-workspace-health`
- Rollback note:
  - remove validator file/registration and restore previous permissive behavior.

### Slice 2: Structured-output fallback parser policy (typed)
- Objective:
  - add deterministic fallback parse policy for malformed structured outputs while preserving typed artifacts.
- Exact target area:
  - Directive Workspace analysis artifact parsing module/spec documentation.
- Validation command(s):
  - `npm run check:directive-v0`
  - `npm run check:directive-integration-proof`
- Rollback note:
  - remove fallback path and keep strict parser only.

### Slice 3: Integration/proof contract template generator
- Objective:
  - generate minimal `IntegrationContractArtifact` + `ProofChecklistArtifact` skeleton from experiment design artifacts.
- Exact target area:
  - Directive Workspace lifecycle contract template docs/schema layer (no runtime callable surface changes).
- Validation command(s):
  - `npm run check:directive-v0`
  - `npm run check:directive-integration-proof`
  - `npm run check:ops-stack`
- Rollback note:
  - remove template generation bindings and keep manual contract entry flow.

## queue effect
- Paper2Code planned-next bundle is now fully materialized for the current cycle.
- Queue moves to broader cross-source architecture backlog execution under `dw-cross-source-wave-01`.

## implementation status update (2026-03-20)

Slice 2 (structured-output fallback parser policy) is now materialized via:
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\structured-output-fallback.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\05-reference-patterns\2026-03-20-structured-output-fallback-parser-policy.md`
- `C:\Users\User\.openclaw\workspace\mission-control\src\lib\directive-workspace\structured-output-fallback.ts`
- `C:\Users\User\.openclaw\workspace\mission-control\scripts\check-directive-structured-output-fallback.ts`

Gate wiring:
- `npm run check:directive-structured-output-fallback`
- `npm run check:ops-stack`

Remaining planned-next:
- none for current cycle (`Slice 3` completed on 2026-03-20).

Slice 3 (integration/proof template generator) is now materialized via:
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\templates\integration-contract-artifact.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\templates\proof-checklist-artifact.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\contracts\integration-proof-template-generator.md`
- `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\05-reference-patterns\2026-03-20-integration-proof-template-generator-policy.md`
- `C:\Users\User\.openclaw\workspace\mission-control\src\lib\directive-workspace\integration-artifact-generator.ts`
- `C:\Users\User\.openclaw\workspace\mission-control\scripts\generate-directive-integration-artifacts.ts`
- `C:\Users\User\.openclaw\workspace\mission-control\scripts\check-directive-integration-artifact-templates.ts`

Gate wiring:
- `npm run check:directive-integration-artifact-templates`
- `npm run check:ops-stack`

Status:
- `product_materialized` for current Architecture cycle.

Schema normalization closure (2026-03-21):
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\schemas\intake-normalized-artifact.schema.json`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\schemas\analysis-plan-artifact.schema.json`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\schemas\experiment-design-artifact.schema.json`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\schemas\integration-contract-artifact.schema.json`
- `C:\Users\User\.openclaw\workspace\directive-workspace\shared\schemas\proof-checklist-artifact.schema.json`
- `C:\Users\User\.openclaw\workspace\directive-workspace\architecture\05-reference-patterns\2026-03-21-paper2code-stage-schema-normalization.md`

Current-cycle note:
- the remaining partial-status gap is closed; the full stage-handoff family is now canonicalized as product-owned Directive Workspace artifacts
