# Superpowers Registry Entry

- Candidate id: superpowers
- Runtime status: callable (bounded-workflow-operator-import-lane)
- Activated date: 2026-03-21
- Host: Mission Control
- Source pack root: `C:\Users\User\.openclaw\workspace\directive-workspace\forge\source-packs\superpowers`
- Primary host checker: `npm run check:directive-superpowers-forge`
- Supporting host evidence command: `npm run forge:superpowers:smoke`
- Required host gate: `npm run check:ops-stack`
- Required pack ready marker: `SOURCE_PACK_READY.md`
- Guardrails:
  - explicit import only
  - no default import activation
  - no plugin marketplace behavior as runtime truth
  - no hook execution or overlay behavior as product truth
- Proof artifact: `C:\Users\User\.openclaw\workspace\directive-workspace\forge\records\2026-03-21-superpowers-runtime-slice-01-proof.md`
- Promotion artifact: `C:\Users\User\.openclaw\workspace\directive-workspace\forge\promotion-records\2026-03-21-superpowers-promotion-record.md`
- Runtime note: this lane only surfaces one bounded workflow operator agent through the import-pack API. It does not promote the full upstream plugin/runtime system.
