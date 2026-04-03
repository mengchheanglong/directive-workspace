# Temp Directive Root Check Helper Deduplication

- Affected layer: shared verification infrastructure under `scripts/`
- Owning lane: shared operator/check surface
- Mission usefulness: centralize repeated temp-root workspace staging and cleanup across bounded checker families
- Proof path:
  - `npm run check:case-event-parity`
  - `npm run check:case-snapshot-parity`
  - `npm run check:discovery-front-door-projection-parity`
  - `npm run check:note-architecture-closeout-projection-parity`
  - `npm run check:runtime-callable-execution-surface`
  - `npm run check:case-planner-parity`
  - `npm run check`
- Rollback path: remove `scripts/temp-directive-root.ts` and restore per-script `mkdtemp` / `directive-workspace` / cleanup blocks

Completed:
- added `scripts/temp-directive-root.ts` as the shared temp workspace helper
- migrated the verified parity and runtime execution-surface checks to the shared helper
- migrated the broader runtime temp-root family to the same helper shape
- updated `scripts/check-case-event-parity.ts` to reflect the current mirrored linked-artifact shape exposed during verification

Stop summary:
- repeated temp-root setup is centralized behind one bounded helper
- the default repo verification suite still passes after the helper extraction
