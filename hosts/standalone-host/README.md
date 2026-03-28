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
- `runtime.ts`
- `persistence.ts`
- `runtime.ts`
- `index.ts`
- `cli.ts`
- `server.ts`
- `standalone-host.config.example.json`
- `examples/runtime-follow-up.example.json`
- `examples/runtime-record.example.json`
- `examples/runtime-proof-bundle.example.json`
- `examples/runtime-transformation-proof.example.json`
- `examples/runtime-transformation-record.example.json`
- `examples/runtime-promotion-record.example.json`
- `examples/runtime-registry-entry.example.json`

Available commands:
- `init`
- `acceptance-quickstart`
- `discovery-submit`
- `discovery-overview`
- `runtime-followup-write`
- `runtime-record-write`
- `runtime-proof-write`
- `runtime-transformation-proof-write`
- `runtime-transformation-record-write`
- `runtime-promotion-write`
- `runtime-registry-write`
- `runtime-scientify-bundle`
- `runtime-overview`
- `serve`

Bootstrap/init:
- `init --output-root <path>` scaffolds a usable local standalone host folder
- generated assets include:
  - `standalone-host.config.json`
  - `directive-root/discovery/intake-queue.json`
  - `discovery-submission.queue-only.example.json`
  - `runtime-follow-up.example.json`
  - `runtime-record.example.json`
  - `runtime-proof-bundle.example.json`
  - `runtime-transformation-proof.example.json`
  - `runtime-transformation-record.example.json`
  - `runtime-promotion-record.example.json`
  - `runtime-registry-entry.example.json`
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
- `GET /api/runtime/overview?max_entries=<n>`
- `POST /api/runtime/follow-ups`
- `POST /api/runtime/records`
- `POST /api/runtime/proof-bundles`
- `POST /api/runtime/transformation-proofs`
- `POST /api/runtime/transformation-records`
- `POST /api/runtime/promotion-records`
- `POST /api/runtime/registry-entries`

Engine-backed Discovery front door:
- `discovery-submit --process-with-engine` keeps source entry at the existing Discovery front door, then runs the submitted source through the Directive Engine
- the standalone host persists the full `DirectiveEngineRunRecord` as a JSON runtime artifact and writes a paired Markdown run summary
- the CLI/API response returns the persisted artifact paths plus the full Engine run record so the host can consume the canonical Engine-owned output directly
- `dry_run` still skips Engine persistence and reports that the Engine step was not executed

Current bounded Runtime-side local workflow support:
- write a Runtime follow-up artifact from JSON input
- write a Runtime record artifact from JSON input
- generate a Runtime proof checklist plus gate snapshot JSON from JSON input
- write a Runtime transformation proof artifact from JSON input
- write a Runtime transformation record artifact from JSON input
- write a Runtime promotion record from JSON input
- write a Runtime registry entry from JSON input
- read a non-executing Scientify literature-access bundle descriptor from canonical Runtime truth
- read a Runtime overview across local follow-up, record, proof, transformation proof, transformation record, promotion, and registry artifacts
- require a real linked proof artifact before promotion and registry writes can advance
- keep this lane bounded to local/shareable workflow artifacts, not full Runtime runtime parity

This is a reference host, not the full runtime replacement for Mission Control.
Mission Control remains the first broad runtime host.
