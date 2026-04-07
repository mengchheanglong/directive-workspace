# 2026-04-07 Standalone Research Vault Host Descriptor Adapter

- affected layer: Runtime to standalone-host adapter seam for one fresh imported Runtime candidate
- owning lane: Runtime
- mission usefulness: turn one fresh Runtime import that already reached `runtime.promotion_record.opened` into a real repo-native host-backed usable surface without overstating execution, registry acceptance, or host integration
- proof path:
  - `npm run check:standalone-research-vault-host-adapter`
  - `npm run check:standalone-research-vault-host-adapter-boundary`
  - `npm run report:standalone-research-vault-host-consumption`
  - `node --experimental-strip-types ./hosts/standalone-host/cli.ts runtime-research-vault-descriptor --directive-root .`
  - `npm run check`
- rollback path:
  - revert `hosts/standalone-host/runtime-lane.ts`
  - revert `hosts/standalone-host/runtime.ts`
  - revert `hosts/standalone-host/cli.ts`
  - revert `hosts/standalone-host/server.ts`
  - revert `hosts/standalone-host/persistence.ts`
  - revert `hosts/standalone-host/index.ts`
  - revert `hosts/standalone-host/README.md`
  - revert `package.json`
  - revert `scripts/check-batches.ts`
  - delete `scripts/check-standalone-research-vault-host-adapter.ts`
  - delete `scripts/check-standalone-research-vault-host-adapter-boundary.ts`
  - delete `scripts/report-standalone-research-vault-host-consumption.ts`
  - delete `runtime/standalone-host/host-consumption/2026-04-07-research-engine-web-aakashsharan-com-research-va-20260407t052643z-20260407t052702.-host-consumption-report.json`
  - remove this log entry

## Candidate and host

- candidate: `research-engine-web-aakashsharan-com-research-va-20260407t052643z-20260407t052702.`
- host: `Directive Workspace standalone host (hosts/standalone-host/)`

This pair was the highest-ROI bounded choice because the candidate is fresh, already reaches `runtime.promotion_record.opened`, already has a host-selection resolution artifact selecting the standalone host, and the standalone host already supports truthful read-only Runtime descriptor surfaces without requiring a new generic host framework.

## Bounded slice

- added one candidate-specific standalone-host descriptor reader backed by canonical promotion-record truth plus the linked promotion-specification and host-selection-resolution artifacts
- kept the host surface explicitly read-only and descriptor-only:
  - no runtime execution claim
  - no host integration claim
  - no registry acceptance claim
  - no promotion automation claim
- added one regression checker for the real chosen candidate path
- added one boundary checker proving the adapter fails closed when the host-selection-resolution artifact is missing
- added one host-consumption report surface for the descriptor-only proof
- repaired the standalone-host CLI/server ESM import chain so the real descriptor command runs through the actual host path, not just test helpers

## Proof notes

- the adapter reads canonical Runtime truth from the promotion record and linked artifacts
- stale `pending_host_selection` values still present in the promotion specification are not trusted as final host truth
- the adapter requires the host-selection-resolution artifact and derives the effective host-backed descriptor from that resolution before exposing the host surface
- the real standalone-host CLI command now returns the descriptor for the selected candidate and reports the truthful stop-line:
  - `runtime.promotion_record.opened`
  - registry acceptance, runtime execution, host integration, and promotion automation remain unopened

## Stop-line

STANDARD mode. One fresh imported Runtime candidate now has a real repo-native standalone-host descriptor surface. This slice intentionally stops short of runtime execution, callable implementation, registry acceptance, broader host integration, and any claim that the path is generic beyond this one candidate.
