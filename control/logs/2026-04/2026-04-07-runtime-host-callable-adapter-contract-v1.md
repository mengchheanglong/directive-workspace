# Runtime Host Callable Adapter Contract v1

- Date: 2026-04-07
- Affected layer: Runtime-to-host contract surface
- Owning lane: Runtime
- Mission usefulness: make host-backed callable truth reusable across two proven paths without claiming generic support, source execution, registry acceptance, or promotion automation.
- Proof path: `npm run check:runtime-host-callable-adapter-contract`, `npm run check:standalone-research-vault-host-callable`, `npm run check:standalone-scientify-host-consumption`, `npm run check:runtime-batch`, `npm run check`.
- Rollback path: remove `runtime/lib/runtime-host-callable-adapter-contract.ts`, `shared/contracts/host-callable-adapter.md`, `shared/schemas/host-callable-adapter.v1.schema.json`, the contract checker, and the host-report descriptor fields for Research Vault and Scientify.
- Stop-line: only Research Vault descriptor-callable and Scientify Runtime-callable execution adopt `host_callable_adapter.v1`; no new candidate support, no source execution claim, no registry write, and no promotion automation.

## Changes

- Added `host_callable_adapter.v1` contract documentation and JSON schema.
- Added Runtime helper builders for descriptor-only and Runtime-callable-execution host adapter descriptors.
- Added the shared descriptor to the Research Vault descriptor callable and host reports.
- Added the shared descriptor to the Scientify standalone-host consumption path and stored report.
- Added a dedicated checker proving descriptor-only and Runtime-callable-execution shapes remain distinguishable and that source execution, registry acceptance, promotion automation, and Runtime-bypass claims stay false in this contract version.

## Boundary

This slice extracts a shared shape from two already-proven paths. It does not broaden host integration to all Runtime imports and does not change Discovery, Architecture, registry acceptance, or autonomous promotion policy.
