# 2026-04-04 host data deep-tail detail-reader consolidation

## why
- Opportunity 3 was only partially complete after the earlier path-helper slice.
- `hosts/web-host/data.ts` still had six repeated Architecture deep-tail detail readers with the same path validation, focus resolution, current-head shaping, and error handling structure.

## completed
- Added one generic Architecture deep-tail detail reader inside `hosts/web-host/data.ts`.
- Reduced these exported readers to thin wrappers over that generic implementation:
  - `readDirectiveFrontendArchitectureImplementationTargetDetail`
  - `readDirectiveFrontendArchitectureImplementationResultDetail`
  - `readDirectiveFrontendArchitectureRetentionDetail`
  - `readDirectiveFrontendArchitectureIntegrationRecordDetail`
  - `readDirectiveFrontendArchitectureConsumptionRecordDetail`
  - `readDirectiveFrontendArchitecturePostConsumptionEvaluationDetail`
- Kept exported names stable.
- Kept response fields, downstream-link derivation, and next-legal-step semantics unchanged.

## proof
- `npm run check:frontend-host`
- `npm run check:host-adapter-boundary`
- `npm run check:directive-workspace-composition`
- `npm run check`

## result
- Opportunity 3 is now complete.
- Host-side Architecture deep-tail detail reading is materially less repetitive without crossing the host boundary or changing product truth.
