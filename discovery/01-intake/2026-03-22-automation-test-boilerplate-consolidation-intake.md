# Discovery Fast-Path Record: Automation Backend Test Boilerplate Consolidation

- Candidate id: dw-transform-automation-test-boilerplate
- Candidate name: Automation Backend Test Boilerplate Consolidation
- Source type: internal-signal
- Source reference: mission-control/scripts/check-automation-*-api-backend.ts
- Received at: 2026-03-22
- Discovery record date: 2026-03-22

## Intake

9 automation backend test scripts share ~60 lines of identical boilerplate with the already-extracted `backend-test-helper.ts` (waitForHealth, backend build/spawn, health check, cleanup). The same `withBackendTestEnv` helper can be directly reused.

## Triage

- Value type: behavior-preserving transformation
- Adoption target: Runtime
- Mission alignment: Runtime operationalization — maintainability and reliability of the automation verification surface
- Addresses known capability gap: gap-discovery-front-door-coverage (native Discovery entry)
- Compaction reason: n/a

## Routing

- Decision state: route_to_runtime_follow_up
- Adoption target: Directive Runtime
- Route date: 2026-03-22

## Evidence

- Baseline: 9 files, 1,678 lines, 57,602 bytes
- Shared pattern: identical `waitForHealth`, `tempDir`, `backendProcess` setup, cleanup — same pattern already consolidated for 6 agents check scripts
- Existing helper: `backend-test-helper.ts` with `withBackendTestEnv()` can be reused directly
- Proof method: dimensional evaluator (before/after lines and bytes) + all 9 `npm run check:*` scripts pass
