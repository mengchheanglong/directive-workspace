Cycle 2

Chosen task:

Add a bounded Directive Workspace importer for `research-engine` source-intelligence bundles.

Why it won:

It proves the external-feeder seam the repo now needs without giving `research-engine` any routing or adoption authority.

Affected layer:

Discovery shared import boundary and verification.

Owning lane:

Discovery

Mission usefulness:

Directive Workspace can now consume external source-intelligence packets through its canonical front door instead of relying on manual review only.

Proof path:

1. Add a pure adapter from `research-engine` packet candidates to `DiscoverySubmissionRequest`.
2. Add a thin importer that reads `dw_import_bundle.json`, selects bounded candidates, and submits them through `submitDirectiveDiscoveryFrontDoor(...)`.
3. Add a temp-root verification script that proves imported submissions stay `queue_only`, stay `note` mode, and resolve through the canonical state reader.

Rollback path:

Delete the importer library, CLI, check script, package scripts, and README note.

Stop-line:

Directive Workspace can import a `research-engine` bundle into normal Discovery review artifacts without creating a parallel route-opening path.

Files touched:

- `shared/lib/research-engine-discovery-import.ts`
- `shared/lib/discovery/index.ts`
- `scripts/import-research-engine-discovery-bundle.ts`
- `scripts/check-research-engine-discovery-import.ts`
- `package.json`
- `README.md`
- `control/logs/2026-04/2026-04-01-research-engine-shadow-import-seam.md`

Verification run:

- `npm run check:research-engine-discovery-import`
- `npm run check`
- `npm run report:directive-workspace-state`

Result:

Bounded external source-intelligence import now exists and routes only through the canonical Discovery front door.

Next likely move:

Use the importer against a real `research-engine` artifact bundle and review the imported Discovery records as a shadow workflow.

Risks / notes:

- The default selection intentionally imports only `strong_signals`; broader candidate imports require explicit `--candidate-id` input.
- Imported candidate ids are prefixed with `research-engine-` so Discovery artifacts stay clearly external-sourced and collision-resistant.
