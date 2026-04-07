# Registry Entry: Scientify Literature-Access Tool Bundle

- Candidate id: dw-source-scientify-research-workflow-plugin-2026-03-27
- Candidate name: Scientify Literature-Access Tool Bundle
- Registry date: 2026-04-07
- Linked promotion record: `runtime/07-promotion-records/2026-04-01-dw-source-scientify-research-workflow-plugin-2026-03-27-promotion-record.md`
- Host: Directive Workspace standalone host (hosts/standalone-host/)
- Runtime surface: standalone_host_runtime_scientify_invoke
- Runtime status: registry.accepted_manual_runtime_callable_execution
- Proof path: `runtime/standalone-host/host-consumption/2026-04-02-dw-source-scientify-research-workflow-plugin-2026-03-27-host-consumption-report.json`
- Last validated by: npm run check:runtime-registry-acceptance-gate && npm run check:standalone-scientify-host-consumption
- Last validation date: 2026-04-07
- Active risks:
- Registry acceptance is manual and bounded to the standalone-host Scientify literature-access callable.
- Imported-source execution, promotion automation, and generic host integration remain out of scope.
- Rollback path: Delete this registry entry and keep the Scientify promotion record at manual promotion state; no Runtime callable source files need to be removed.
- Notes:
- Accepted through runtime_registry_acceptance_gate.v1 after promotion record, promotion specification, host adapter report, and callable execution evidence were verified.
- This is one manually accepted Runtime-owned callable capability, not blanket registry acceptance for descriptor-only or future Runtime imports.

## Registry Acceptance Gate

- Gate version: `runtime_registry_acceptance_gate.v1`
- Acceptance state: `accepted`
- Accepted by: Directive Workspace operator
- Accepted at: `2026-04-07T12:30:00.000Z`
- Host callable adapter report: `runtime/standalone-host/host-consumption/2026-04-02-dw-source-scientify-research-workflow-plugin-2026-03-27-host-consumption-report.json`
- Callable execution evidence: `runtime/callable-executions/2026-04-02T14-30-00-000Z-dw-source-scientify-research-workflow-plugin-2026-03-27-openalex-search.json`
- Descriptor-only registry status allowed: `false`
- Gate notes:
- Scientify is accepted because it has runtime_callable_execution host-adapter proof and a successful Runtime callable execution record.

