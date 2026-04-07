# 2026-04-05 Engine Run Canonical Schema Tightening

## Affected layer

- Engine run record/report contract

## Owning lane

- Engine core

## Mission usefulness

- Make the richer Engine run surface explicitly canonical instead of relying only on TypeScript types and permissive readers.
- Preserve backward compatibility for historical Engine runs while tightening the contract for newly written runs.

## Slice

- added explicit record metadata to new `DirectiveEngineRunRecord` outputs:
  - `$schema`
  - `schemaVersion`
  - `recordKind`
- introduced `shared/schemas/directive-engine-run-record.schema.json` as the canonical persisted run-record schema
- updated the standalone Engine report renderer to surface the record schema version and schema ref in the paired markdown report
- added `scripts/check-directive-engine-run-canonical-surface.ts` to generate a real Engine run in a temp host, then validate the canonical record metadata and paired report headings
- wired the new checker into the foundation check batch

## Proof path

- `npm run check:directive-engine-run-canonical-surface`
- `npm run check:directive-engine-stage-chaining`
- `npm run check:frontend-host`
- `npm run check`

## Rollback path

- revert `engine/types.ts`
- revert `engine/directive-engine.ts`
- revert `hosts/standalone-host/runtime.ts`
- revert `shared/lib/engine-run-artifacts.ts`
- revert `shared/schemas/directive-engine-run-record.schema.json`
- revert `shared/schemas/README.md`
- revert `scripts/check-directive-engine-run-canonical-surface.ts`
- revert `scripts/check-frontend-host.ts`
- revert `scripts/check-batches.ts`
- revert `package.json`
- delete this log

## Stop summary

- stopped after canonicalizing the forward Engine run record/report contract
- did not rewrite historical run artifacts or broaden into a larger reporting-surface redesign
