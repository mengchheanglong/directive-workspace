Cycle

Chosen task:

Finish Research Engine as a Discovery-owned capability inside Directive Workspace instead of leaving it as a merely safe importer.

Why it won:

The hardening pass closed failure modes, but current repo truth still showed three same-task integration gaps:

1. imported Research Engine entries were still generic `external-system` rows with no first-class origin in canonical state/report truth
2. the DW packet/export contract still carried route/adoption-style hint fields that Discovery should decide itself
3. repo-owned docs still framed Research Engine too much like a broader standalone subsystem instead of a Discovery capability

Affected layer:

Discovery front door, shared Engine state/report truth, Research Engine DW packet contract, and Discovery-owned doctrine/docs.

Owning lane:

Discovery

Mission usefulness:

Directive Workspace can now treat Research Engine as a real Discovery skill: the queue records it explicitly, the canonical state resolver reports it coherently, the handoff packet is limited to Discovery-useful evidence, and the docs match the product boundary.

Proof path:

1. Add explicit `submission_origin = research-engine` to imported Discovery queue entries.
2. Surface that origin plus source type/reference through the canonical shared state report.
3. Narrow the Research Engine DW packet/export contract to Discovery-useful handoff fields only.
4. Preserve Discovery-useful evidence context (`baggage`, `evidence cluster summary`, `contradiction flags`) in imported notes instead of route/adoption hints.
5. Update repo-owned docs and package-facing readmes so Research Engine is framed as Discovery-owned.
6. Re-run the dedicated seam check, focused state report, Python-side RE test coverage, and the full repo check stack.

Rollback path:

Revert only the Research Engine Discovery integration files and this bounded log.

Stop-line:

Research Engine is fully integrated once DW code, state/report truth, packet/export contract, and docs all treat it as a Discovery capability with no route/adoption authority leakage.

Files touched:

- `shared/lib/discovery-intake-queue-writer.ts`
- `shared/lib/discovery-front-door.ts`
- `shared/lib/discovery-submission-router.ts`
- `shared/lib/research-engine-discovery-import.ts`
- `shared/lib/dw-state.ts`
- `scripts/check-research-engine-discovery-import.ts`
- `scripts/import-research-engine-discovery-bundle.ts`
- `engine/workspace-truth.ts`
- `README.md`
- `discovery/research-engine/README.md`
- `discovery/research-engine/implement.md`
- `discovery/research-engine/docs/research-engine-dw-alignment.md`
- `discovery/research-engine/schemas/dw_discovery_packet.schema.json`
- `discovery/research-engine/schemas/dw_import_bundle.schema.json`
- `discovery/research-engine/src/research_engine/models.py`
- `discovery/research-engine/src/research_engine/contracts.py`
- `discovery/research-engine/src/research_engine/export.py`
- `discovery/research-engine/tests/test_run.py`
- `discovery/research-engine/artifacts/dw_discovery_packet.json`
- `discovery/research-engine/artifacts/dw_import_bundle.json`
- `discovery/research-engine/artifacts/source_intelligence_packet.json`
- `control/logs/2026-04/2026-04-01-research-engine-discovery-full-integration.md`

Verification run:

- `npm run check:research-engine-discovery-import`
- `npm run report:directive-workspace-state`
- `python -m unittest tests.test_run -q`
- `python -m research_engine --output-dir artifacts --acquisition-mode catalog`
- `npm run check`

Result:

Research Engine now behaves as a Discovery-owned source-intelligence capability in Directive Workspace rather than a generic external subsystem seam.

Next likely move:

Use the fully integrated Discovery skill against a real Research Engine bundle and review whether a bounded operator-facing intake/report surface is worth opening later.
