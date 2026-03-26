# v0 Normalizer Transformation Registry Entry

- Candidate id: dw-transform-v0-normalizer-consolidation
- Runtime status: live (behavior-preserving transformation applied)
- Activated date: 2026-03-22
- Host: Mission Control
- Target file: runtime/core/v0.ts (mirrored to mission-control/src/lib/directive-workspace/v0.ts)
- Primary host checker: `npm run check:directive-transformation-proof`
- Supporting host evidence command: `npm run check:directive-runtime-sync`
- Required host gate: `npm run typecheck`
- Guardrails:
  - same 10 exported normalizer function signatures
  - same types, same error messages
  - no new exports, no new dependencies
  - no behavioral changes
- Proof artifact: `runtime/records/2026-03-22-v0-normalizer-transformation-proof.json`
- Promotion artifact: `runtime/promotion-records/2026-03-22-v0-normalizer-transformation-promotion-record.md`
- Runtime note: this is a behavior-preserving transformation that reduced the normalizer implementation from 126 to 55 lines using a generic createNormalizer factory. The external API is identical.
