# Runtime Automation Eligibility Policy

Date: 2026-04-07

## Bounded Slice

Added `runtime_automation_eligibility_policy.v1` as an explicit Runtime candidate-class taxonomy for host integration, callable execution, registry acceptance, and promotion automation.

## Required State

- Affected layer: Engine / Runtime policy reporting
- Owning lane: Runtime
- Mission usefulness: makes Runtime automation non-claims machine-readable before source-class expansion
- Proof path: `npm run check:runtime-automation-eligibility-policy`, `npm run report:runtime-automation-eligibility-policy`, existing promotion-automation gate checks, runtime batch, full check
- Rollback path: remove the eligibility policy module/check/report, remove the dry-run fields/gate, remove the package and batch entries
- Stop-line: no new host adapter, callable execution, registry acceptance, promotion automation, or source-class expansion

## Outcome

The policy classifies candidates as:

- `descriptor_only`
- `directive_owned_callable`
- `source_derived_callable`
- `external_app_execution`
- `unsupported`

The existing promotion automation dry-run now reports the effective policy class and reasons while preserving default disabled automation behavior.

## Boundary

This slice does not claim automatic handling of every future source. It also does not claim arbitrary external app execution. Those remain replaced by bounded automation for known eligible source classes and explicitly approved, isolated, schema-bound source-derived adapters.
