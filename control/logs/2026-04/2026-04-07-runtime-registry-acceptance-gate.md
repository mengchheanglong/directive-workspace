# Runtime Registry Acceptance Gate

- Date: 2026-04-07
- Affected layer: Runtime registry / Engine state read surface
- Owning lane: Runtime
- Mission usefulness: make registry acceptance a real proof-backed decision gate after host-callable proof, instead of treating promotion-record presence or file presence as acceptance.
- Proof path: `npm run report:runtime-registry-acceptance-gate`, `npm run check:runtime-registry-acceptance-gate`, `npm run check:runtime-batch`, `npm run check:canonical-read-surface-coverage`, `npm run check:directive-workspace-composition`, and `npm run check`.
- Rollback path: remove `runtime/lib/runtime-registry-acceptance-gate.ts`, remove the registry gate script/report wiring, remove `runtime/08-registry/2026-04-07-dw-source-scientify-research-workflow-plugin-2026-03-27-registry-entry.md`, and revert the Engine state registry-stage distinction.
- Stop-line: one manually accepted Scientify runtime callable only; no automatic registry writes, no descriptor-only registry acceptance, no source-app execution claim, and no promotion automation.

## Bounded Change

- Added `runtime_registry_acceptance_gate.v1` to validate manual registry acceptance against promotion record, promotion specification, host callable adapter report, callable execution evidence when execution is claimed, rollback path, and explicit acceptance flags.
- Wired Runtime registry entry writing through the acceptance gate when `acceptance_gate` is present.
- Added a generated, manually accepted Scientify registry entry after verifying promotion-record proof, standalone-host adapter proof, and successful Runtime callable execution evidence.
- Updated Engine state surfaces so gated registry entries resolve as `runtime.registry.accepted` while promotion records remain `runtime.promotion_record.opened`.
- Added a checker that proves descriptor-only candidates fail closed without explicit policy and runtime-callable acceptance fails closed when execution evidence is missing.

## Adversarial Review Notes

- Fake registry acceptance risk: reduced by requiring an explicit `acceptance_gate` with accepted-by, accepted-at, rollback path, host adapter report, and matching candidate evidence.
- Descriptor-only overclaim risk: blocked by default unless `descriptor_only_registry_status_allowed` is explicitly true.
- Missing execution evidence risk: blocked when the host callable adapter claims `runtimeCallableExecution`.
- State drift risk: checked by asserting that the registry entry is the current head while the promotion record remains a promotion-record artifact.
- Automation risk: not opened; registry entry generation remains manual/scripted and policy-gated.
