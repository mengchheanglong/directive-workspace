# 2026-04-06 Open Deep Research Structural Hint Extraction

- affected layer: Discovery Research Engine DW handoff packet
- owning lane: Architecture-guided improvement through Discovery-owned source intelligence
- mission usefulness: keep the bounded structural value from Open Deep Research by exporting explicit phase and provider-seam hints into Directive Workspace instead of relying only on prose heuristics
- proof path:
  - `npm run check:research-engine-discovery-import`
  - `python -m unittest tests.test_run -q` (from `discovery/research-engine` with `PYTHONPATH=src`)
  - `npm run check:directive-workspace-composition`
- rollback path:
  - revert the DW packet model/schema/export changes in `discovery/research-engine`
  - revert the import-adapter structural-hint consumption in `hosts/adapters/research-engine-discovery-import.ts`
  - remove this log entry

## What changed

- extended `dw_discovery_packet.json` candidate packets with explicit structural hints:
  - `workflow_phase_labels`
  - `provider_seam_summary`
  - `workflow_boundary_shape_hint`
- derived those hints during Research Engine packet export so the source-intelligence layer preserves the useful structure explicitly
- updated the Directive Workspace Research Engine adapter to consume those hints directly before falling back to text heuristics
- proved the extraction on `open-deep-research`:
  - phase labels: `planning`, `discovery`, `compression`, `reporting`
  - provider seam summary: `Reusable provider seams for bounded research runs.`
  - workflow boundary shape: `bounded_protocol`

## Result

- Open Deep Research now contributes a real Directive-owned code improvement:
  - the Discovery import seam can preserve explicit research phase structure and provider seams from Research Engine packets
  - Architecture-relevant routing no longer depends only on weak prose reconstruction
- this keeps the bounded structural value while still rejecting wholesale framework adoption

## Stop-line

This slice deliberately stops at packet/export/import integration. It does not reopen broader Research Engine redesign, replace the current search/scoring pipeline, or auto-approve medium-confidence conflicted Architecture routes.
