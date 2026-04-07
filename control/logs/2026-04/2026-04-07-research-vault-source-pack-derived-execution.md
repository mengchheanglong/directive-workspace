# Research Vault Source-Pack Derived Execution

Date: 2026-04-07

## Scope

- Affected layer: Runtime capability and standalone-host adapter
- Owning lane: Runtime
- Mission usefulness: direct usefulness by turning one fresh Runtime import from descriptor-only host visibility into a bounded Directive-owned source-derived callable execution
- Proof path: `npm run check:standalone-research-vault-source-pack-execution`, standalone-host CLI invocation, generated Runtime callable execution evidence, generated standalone-host execution report, `npm run check:runtime-callable-execution-evidence`, `npm run check:runtime-batch`, and `npm run check`
- Rollback path: remove `runtime/capabilities/research-vault-source-pack/`, revert Research Vault source-pack wiring in `runtime/core/callable-execution.ts`, `hosts/standalone-host/runtime-lane.ts`, `hosts/standalone-host/runtime.ts`, `hosts/standalone-host/cli.ts`, `package.json`, `scripts/check-batches.ts`, and `scripts/check-runtime-callable-execution-evidence.ts`; remove the new checker/report scripts and generated execution/report artifacts
- Stop-line: execute only a Directive-owned static source-pack query derived from Research Vault evidence; do not execute the external Research Vault app, write registry acceptance, automate promotion, or claim generic host integration

## Candidate

- Candidate id: `research-engine-web-aakashsharan-com-research-va-20260407t052643z-20260407t052702.`
- Candidate name: Research Vault: Open Source Agentic AI Research Assistant
- Host: Directive Workspace standalone host (`hosts/standalone-host/`)
- Callable surface: `standalone_host_runtime_research_vault_source_pack_query`

## Change

- Added a Runtime-owned Research Vault source-pack capability with one bounded `query-source-pack` tool over extracted Research Vault phase-model evidence.
- Registered the capability in the shared Runtime callable executor so execution evidence is recorded under `runtime/callable-executions/`.
- Added a standalone-host invocation path that calls the Runtime-owned executor without bypassing Runtime internals.
- Added a generated host execution report linking the promotion record, promotion specification, host-selection resolution, host callable adapter descriptor, and Runtime execution evidence.
- Added regression and boundary checks for successful derived execution, invalid-input handling, and fail-closed behavior when host-selection resolution is absent.

## Boundary

This slice executes a Directive-owned static source-pack query derived from imported-source evidence. It does not run the external Research Vault app, install or vendor Research Vault, claim source runtime execution, write registry acceptance, automate promotion, or generalize host support to all Runtime imports.
