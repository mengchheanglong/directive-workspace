# Standalone Host

This folder contains the minimal product-owned standalone reference host for Directive Workspace.

It is intentionally small:
- filesystem-backed
- local CLI driven
- optional SQLite ledger/index
- bounded HTTP API only
- not yet the broader host replacement for Mission Control

Purpose:
- prove Directive Workspace can execute as a local standalone host without Mission Control
- keep the first standalone runtime surface host-agnostic and reversible
- keep the product shareable for GitHub/local use without pretending host parity is finished

Current files:
- `bootstrap.ts`
- `config.ts`
- `forge.ts`
- `persistence.ts`
- `runtime.ts`
- `index.ts`
- `cli.ts`
- `server.ts`
- `standalone-host.config.example.json`
- `examples/forge-follow-up.example.json`
- `examples/forge-record.example.json`
- `examples/forge-proof-bundle.example.json`
- `examples/forge-transformation-proof.example.json`
- `examples/forge-transformation-record.example.json`
- `examples/forge-promotion-record.example.json`
- `examples/forge-registry-entry.example.json`

Available commands:
- `init`
- `acceptance-quickstart`
- `discovery-submit`
- `discovery-overview`
- `forge-followup-write`
- `forge-record-write`
- `forge-proof-write`
- `forge-transformation-proof-write`
- `forge-transformation-record-write`
- `forge-promotion-write`
- `forge-registry-write`
- `forge-overview`
- `serve`

Bootstrap/init:
- `init --output-root <path>` scaffolds a usable local standalone host folder
- generated assets include:
  - `standalone-host.config.json`
  - `directive-root/discovery/intake-queue.json`
  - `discovery-submission.queue-only.example.json`
  - `forge-follow-up.example.json`
  - `forge-record.example.json`
  - `forge-proof-bundle.example.json`
  - `forge-transformation-proof.example.json`
  - `forge-transformation-record.example.json`
  - `forge-promotion-record.example.json`
  - `forge-registry-entry.example.json`
  - local `README.md`
- expansion direction note:
  - `EXPANSION_DIRECTION.md`

Config and runtime profile:
- canonical example config: `standalone-host.config.example.json`
- canonical config schema: `../../shared/schemas/standalone-host-config.schema.json`
- canonical runtime profile contract: `../../shared/contracts/standalone-host-runtime-profile.md`
- canonical auth guard contract: `../../shared/contracts/standalone-host-api-auth-guard.md`
- canonical SQLite persistence contract: `../../shared/contracts/standalone-host-sqlite-persistence-profile.md`
- default runtime artifact root: `runtime/standalone-host/` under the configured `directiveRoot`
- persisted runtime artifacts:
  - `status.json`
  - `access-log.jsonl`
  - `boot-log.jsonl`
  - `engine-runs/*.json` when Discovery submissions are processed through the Engine
  - `engine-runs/*.md` when Discovery submissions are processed through the Engine
- optional persistence lane:
  - `persistence.mode = filesystem_and_sqlite`
  - default SQLite path: `runtime/standalone-host/standalone-host.sqlite`
  - filesystem artifacts remain canonical; SQLite is a stronger ledger/index, not a replacement
- optional API hardening:
  - `auth.mode = static_bearer`
  - bearer token from `auth.bearerToken` or `auth.bearerTokenEnvName`
  - `/health` stays public while `/api/*` is protected

Reference API endpoints:
- `GET /health`
- `GET /api/runtime/status`
- `GET /api/discovery/overview?max_entries=<n>`
- `POST /api/discovery/submissions?dry_run=1`
- `POST /api/discovery/submissions?process_with_engine=1`
- `GET /api/forge/overview?max_entries=<n>`
- `POST /api/forge/follow-ups`
- `POST /api/forge/records`
- `POST /api/forge/proof-bundles`
- `POST /api/forge/transformation-proofs`
- `POST /api/forge/transformation-records`
- `POST /api/forge/promotion-records`
- `POST /api/forge/registry-entries`

Engine-backed Discovery front door:
- `discovery-submit --process-with-engine` keeps source entry at the existing Discovery front door, then runs the submitted source through the Directive Engine
- the standalone host persists the full `DirectiveEngineRunRecord` as a JSON runtime artifact and writes a paired Markdown run summary
- the CLI/API response returns the persisted artifact paths plus the full Engine run record so the host can consume the canonical Engine-owned output directly
- `dry_run` still skips Engine persistence and reports that the Engine step was not executed

Current bounded Forge-side local workflow support:
- write a Forge follow-up artifact from JSON input
- write a Forge record artifact from JSON input
- generate a Forge proof checklist plus gate snapshot JSON from JSON input
- write a Forge transformation proof artifact from JSON input
- write a Forge transformation record artifact from JSON input
- write a Forge promotion record from JSON input
- write a Forge registry entry from JSON input
- read a Forge overview across local follow-up, record, proof, transformation proof, transformation record, promotion, and registry artifacts
- require a real linked proof artifact before promotion and registry writes can advance
- keep this lane bounded to local/shareable workflow artifacts, not full Forge runtime parity

This is a reference host, not the full runtime replacement for Mission Control.
Mission Control remains the first broad runtime host.
