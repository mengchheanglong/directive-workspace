# scientify Slice 6 Execution (2026-03-19)

## candidate verification
- Candidate: `scientify`
- Local intake path: `C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\scientify`
- Pinned revision: `921d510b06be8ccdb4ef04a202244c9be7ac4367`
- Describe/tag: `v1.12.0-2-g921d510`
- Working tree status: clean (`git status --short` returned empty)

## bounded experiment contract (defined before run)
- Objective: verify whether scientify exposes a reusable quality-gated research-state mechanism for Directive Workspace promotion and handoff quality control (pattern extraction only).
- Timebox: 45 minutes.
- Success criteria:
  1. Explicit quality thresholds and fail reasons are encoded in source.
  2. Quality-sensitive statuses degrade deterministically when gate criteria fail.
  3. Validation-state model includes explicit external-validation outcomes.
  4. Human-readable quality summary output exists for observability.

## reproducible proof
### scope (read-only)
- `src/knowledge-state/store.ts`
- `src/knowledge-state/types.ts`
- `src/knowledge-state/render.ts`
- `src/research-subscriptions/prompt.ts`

### proof command
- One deterministic PowerShell static check over the files above (regex assertions for threshold constants, downgrade path, validation states, and rendered quality summary fields).

### proof output
```json
{
  "threshold_fulltext_80": true,
  "threshold_evidence_90": true,
  "threshold_citation_2pct": true,
  "quality_gate_failure_reasons": true,
  "downgrade_to_degraded_quality": true,
  "openreview_validation_states": true,
  "quality_gate_rendered_summary": true,
  "optional_openreview_promotion_step": true,
  "verdict": "pass"
}
```

## extracted pattern candidates
1. **Quality-gate triplet with explicit fail reasons**
- Full-text coverage, evidence-binding rate, and citation-error thresholds with reason strings.
- Extraction target: Directive promotion-quality gate policy for experiment-to-decision transitions.

2. **Deterministic downgrade path**
- Quality-sensitive statuses are downgraded to `degraded_quality` when gate fails.
- Extraction target: handoff hardening rule to prevent overconfident promotion.

3. **Validation-state extension and optional external validation loop**
- `openreview_related` and `openreview_not_found` states, plus optional `openreview_lookup` before promotion.
- Extraction target: explicit validation-state taxonomy and optional escalation checks in Directive evaluation templates.

4. **Rendered quality summary for operators**
- Pass/fail and metric percentages are rendered in summary output.
- Extraction target: standard quality telemetry block in promotion proof artifacts.

## integration cost / risk / rollback
- Integration mode: `adapt` (pattern extraction only; no scientify runtime import).
- Estimated cost: medium (policy template + checker wiring + threshold tuning).
- Risks:
  - Thresholds may need domain-specific calibration to avoid false negatives.
  - Validation-state expansion can increase operator overhead if mandatory by default.
  - Optional external validation calls can increase latency if overused.
- Rollback:
  1. Remove this execution artifact.
  2. Remove Slice 6 adopted/deferred decision artifact.
  3. Remove Slice 6 section from day closure note.
  4. No runtime/API rollback required (no mission-control runtime integration in this slice).

## runway/cutover guard check
- No API contract changes were made.
- No runtime feature integration from external scientify repository was performed.

## gate results (post-infra-fix rerun)
- `npm run check:directive-v0` -> PASS
- `npm run check:directive-integration-proof` -> PASS
- `npm run check:directive-workspace-health` -> PASS
- `npm run check:ops-stack` -> PASS
