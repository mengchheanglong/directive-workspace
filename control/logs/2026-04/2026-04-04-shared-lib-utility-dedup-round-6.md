# 2026-04-04 - Shared/lib utility dedup round 6

- Scope: bounded shared-lib production-module dedup only.
- Intent: reduce repeated workspace-root bootstrap, relative-path containment, simple JSON reads, and canonical string-validation helpers without changing product behavior.

## Completed

- Added canonical `readJson<T>()` to `shared/lib/architecture-deep-tail-artifact-helpers.ts`.
- Added canonical `writeJsonPretty()` to `shared/lib/architecture-deep-tail-artifact-helpers.ts`.
- Migrated repeated `normalizePath()` + `getDefaultDirectiveWorkspaceRoot()` copies onto the canonical helper in:
  - `shared/lib/architecture-materialization-due-check.ts`
  - `shared/lib/architecture-result-adoption.ts`
  - `shared/lib/bounded-persistent-coordination.ts`
  - `shared/lib/completion-slice-selector.ts`
  - `shared/lib/discovery-gap-worklist-selector.ts`
  - `shared/lib/engine-run-artifacts.ts`
  - `shared/lib/operational-architecture-improvement-candidates.ts`
  - `shared/lib/operator-simplicity-loop-control.ts`
  - `shared/lib/read-only-lifecycle-coordination.ts`
  - `shared/lib/run-evidence-aggregation.ts`
  - `shared/lib/runtime-loop-control.ts`
  - `shared/lib/runtime-promotion-assistance.ts`
- Migrated repeated `resolveDirectiveRelativePath()` copies onto the canonical helper in:
  - `shared/lib/architecture-result-adoption.ts`
  - `shared/lib/completion-slice-selector.ts`
  - `shared/lib/discovery-gap-worklist-selector.ts`
  - `shared/lib/operator-simplicity-loop-control.ts`
- Migrated exact simple `readJson<T>()` copies onto the canonical helper in:
  - `shared/lib/discovery-front-door.ts`
  - `shared/lib/case-store.ts`
  - `shared/lib/directive-runner-state.ts`
  - `shared/lib/runtime-callable-execution-evidence.ts`
  - `shared/lib/bounded-persistent-coordination.ts`
  - `shared/lib/read-only-lifecycle-coordination.ts`
  - `shared/lib/discovery-gap-worklist-selector.ts`
- Migrated the canonical `requiredString()` / `optionalString()` pair onto the shared helper in:
  - `shared/lib/architecture-result-adoption.ts`
  - `shared/lib/discovery-case-record-writer.ts`
  - `shared/lib/discovery-completion-record-writer.ts`
  - `shared/lib/discovery-fast-path-record-writer.ts`
  - `shared/lib/discovery-routing-record-writer.ts`
- Extended the same bounded helper dedup into the remaining exact or low-risk copies in:
  - `shared/lib/directive-runner-state.ts`
  - `shared/lib/case-store.ts`
  - `shared/lib/discovery-front-door.ts`
  - `shared/lib/architecture-bounded-closeout.ts`
  - `shared/lib/discovery-route-opener.ts`
  - `shared/lib/research-engine-discovery-import.ts`
  - `shared/lib/discovery-intake-queue-writer.ts`
  - `shared/lib/discovery-submission-router.ts`
  - `shared/lib/discovery-intake-lifecycle-sync.ts`
  - `shared/lib/discovery-intake-queue-transition.ts`
  - `shared/lib/openclaw-discovery-submission-adapter.ts`
  - `shared/lib/openclaw-maintenance-watchdog-signal-adapter.ts`
  - `shared/lib/openclaw-runtime-verification-signal-adapter.ts`
  - `shared/lib/architecture-closeout.ts`
  - `shared/lib/runtime-promotion-assistance.ts`

## Guardrails kept

- Left local JSON readers in place where behavior differs, including try/catch null-return readers and file-exists wrappers.
- Left local string helpers in place where optional-string coercion semantics differ.
- Left storage-local and `shared/lib/dw-state/` path helpers in place because they currently carry submodule-specific semantics or containment wording.
- Kept exported module entrypoints and artifact/state semantics unchanged.

## Boundary reached

- Audited the next redesign-class frontier after Tier 1 cleanup.
- The first attempted runtime projection-family scaffolding slice was rolled back after `check:runtime-capability-boundary-projection-parity` exposed a latent candidate-specific execution-state drift not represented in current mirrored projection inputs.
- Stopped at the last fully verified boundary instead of forcing a generic runtime projection framework over semantic variation.

## Proof

- `npm run check:architecture-materialization-due-check`
- `npm run check:runtime-loop-control`
- `npm run check:directive-workspace-composition`
- `node --experimental-strip-types ./scripts/openclaw/check-openclaw-discovery-submission-adapter.ts`
- `node --experimental-strip-types ./scripts/openclaw/check-openclaw-runtime-verification-signal-adapter.ts`
- `npm run check`
