# gh-aw Slice 4 Execution (2026-03-19)

## candidate verification
- Candidate: `gh-aw` (GitHub Agentic Workflows)
- Intake path: `C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\gh-aw`
- Pinned revision: `3a35d272bcf0b69b78ab83e42be9c667caa043aa`
- Describe/tag: `v0.61.0-23-g3a35d272b`
- Working tree state: clean (`git status --short` returned no changes)

## bounded experiment contract (defined before run)
- Objective: validate extractable safety architecture pattern from gh-aw without adopting runtime framework.
- Timebox: 45 minutes.
- Success criteria:
  1. One workflow markdown + compiled lock file pair shows least-privilege separation.
  2. Agent execution path remains read-only while safe-output path owns explicit write scope.
  3. Sanitization controls are present in compiled output.
- Selected sample:
  - `.github/workflows/daily-safe-outputs-conformance.md`
  - `.github/workflows/daily-safe-outputs-conformance.lock.yml`

## experiment steps (reproducible)
1. Confirm gh-aw pin and cleanliness via git commands.
2. Inspect sample markdown and compiled lock workflow.
3. Run static conformance proof script (PowerShell) checking:
   - `safe-outputs` declaration in markdown
   - read-only permissions in markdown
   - empty top-level permissions in lock file
   - read-only activation permissions in lock file
   - write scope only in safe-output/conclusion path
   - sanitize flags in compiled config

## proof output
```json
{
  "md_has_safe_outputs": true,
  "md_permissions_read_only": true,
  "lock_top_permissions_empty": true,
  "lock_has_activation_read": true,
  "lock_has_safe_output_write_scope": true,
  "lock_has_sanitize_flags": true,
  "verdict": "pass"
}
```

## extracted patterns for directive workspace
1. **Two-lane permission split**: keep agent lane read-only; route writes through a constrained safe-output lane.
2. **Compile-time contract**: treat source markdown intent as non-runtime artifact; execute only compiled/validated lock output.
3. **Sanitized operation envelope**: use explicit sanitize flags and constrained operation configs for write actions.
4. **Tracker identity**: workflow-id/tracker-id based traceability for lifecycle observability and cleanup.

## integration fit, cost, risk
- Integration mode: `adapt` (pattern extraction only).
- Estimated cost: low-medium (doc/runbook + lightweight checker integration; no runtime replacement).
- Operational risk: low if kept as policy/check pattern only; medium if full gh-aw runtime were adopted directly.
- API contract impact: none in this slice.

## rollback
- Remove this experiment note.
- Remove associated adopted/deferred note for this slice.
- Remove queue update section in day closure note.
- No runtime/API rollback needed (architecture-lab documentation slice only).

## gate results
- `npm run check:directive-v0` -> PASS
- `npm run check:directive-integration-proof` -> PASS
- `npm run check:directive-workspace-health` -> PASS
- `npm run check:ops-stack` -> PASS
