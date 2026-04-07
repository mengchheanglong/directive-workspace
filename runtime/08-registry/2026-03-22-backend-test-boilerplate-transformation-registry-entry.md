# Registry Entry: Backend Test Boilerplate Consolidation

- Candidate ID: dw-transform-backend-test-boilerplate
- Registry date: 2026-03-22
- Runtime status: live (behavior-preserving transformation applied)
- Host: mission-control
- Runtime surface: scripts/backend-test-helper.ts (consumed by 6 check-agents-*-api-backend.ts scripts)

## What is live

Shared `withBackendTestEnv()` helper function that manages backend test lifecycle (temp dir, SQLite, build, spawn, health check, cleanup). All 6 backend API test scripts use this helper instead of independent boilerplate.

## Guardrails

- Same 6 test scripts, same filenames, same test assertions
- Same ports, temp prefixes, SQLite filenames per script
- Setup callback preserves per-script fixture creation

## Proof reference

- Runtime record: runtime/legacy-records/2026-03-22-backend-test-boilerplate-transformation-record.md
- Promotion record: runtime/07-promotion-records/2026-03-22-backend-test-boilerplate-transformation-promotion-record.md
- Dimensional evaluator: 20.6% line reduction, 16.9% byte reduction (both exceed 10% threshold)
