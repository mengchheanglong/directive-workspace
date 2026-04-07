# Runtime Policy-Gated Promotion Automation

- Date: 2026-04-07
- Affected layer: Engine coordination and Runtime registry proof surfaces
- Owning lane: Runtime
- Mission usefulness: turns registry automation from an implicit non-step into an explicit, dry-runnable, disabled-by-default policy gate without weakening Decide
- Proof path: `npm run check:runtime-promotion-automation-policy-gates`, `npm run report:runtime-promotion-automation-policy-gates`, `npm run check:autonomous-lane-loop`, `npm run check:runtime-batch`, `npm run check`
- Rollback path: remove `engine/coordination/runtime-promotion-automation.ts`, remove the runtime automation policy fields from `engine/coordination/autonomous-lane-loop.ts` and `control/state/autonomous-lane-loop-policy.json`, remove the checker/report scripts and package script entries
- Stop-line: no default registry writes, no automatic host adapter descriptor creation, no automatic host callable execution, no descriptor-only registry acceptance, and no imported-source execution claim

## Bounded Change

- Added `autoHostAdapterDescriptor`, `autoHostCallableExecution`, and `autoWriteRegistryEntry` policy fields, all defaulting to `false`.
- Added a dry-run eligibility report for Runtime promotion automation.
- Added a guarded autonomous-loop transition from `runtime.promotion_record.opened` to a gated registry entry only when policy and evidence both pass.
- Added a regression checker that proves:
  - eligible runtime callable execution can write a registry entry only when policy enables it
  - the default disabled policy reports no write
  - pending host selection blocks before promotion-record stage
  - missing callable execution evidence blocks registry automation
  - descriptor-only host callables cannot be treated as source/runtime execution

## Adversarial Review

- Fake registry writes: blocked by default and by `runtime_registry_acceptance_gate.v1`.
- Fake callable readiness: blocked unless a successful Runtime callable execution record is linked or discoverable.
- Descriptor-only overclaiming: blocked even when a host descriptor report exists.
- Host adapter descriptor auto-creation: not implemented generically; missing reports stop closed.
- Host callable auto-execution: not implemented generically; missing execution evidence stops closed.
- Promotion automation: remains policy-gated and disabled by default.
