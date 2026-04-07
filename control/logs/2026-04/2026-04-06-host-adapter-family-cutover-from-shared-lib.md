# 2026-04-06 Host Adapter Family Cutover From Shared Lib

## Affected layer

- host-owned adapter edge and residual `shared/lib/` ownership clarity

## Owning lane

- Engine cross-cutting infrastructure with host-adapter ownership

## Mission usefulness

- make the remaining non-lane code in `shared/lib/` more truthful by removing the externally facing adapter family from that residual support surface
- keep Discovery as the front door while making OpenClaw and Research Engine integration code visibly adapter-owned instead of ambiguously shared

## Slice

- moved the host/external adapter family from `shared/lib/` into `hosts/adapters/`:
  - `openclaw-discovery-submission-adapter.ts`
  - `openclaw-maintenance-watchdog-signal-adapter.ts`
  - `openclaw-runtime-verification-signal-adapter.ts`
  - `research-engine-discovery-import.ts`
- added `hosts/adapters/index.ts`
- added `hosts/adapters/README.md`
- updated Discovery barrel re-exports to point at the new adapter home
- updated direct checker/CLI imports for:
  - OpenClaw adapter checks
  - Research Engine discovery import checker
  - Research Engine discovery import CLI
- added direct package/root exports for the adapter home
- updated `shared/lib/README.md` and `hosts/README.md` so the repo now describes adapters as host-owned rather than residual shared support

## Proof path

- `npm run check:openclaw-discovery-submission-adapter`
- `npm run check:openclaw-maintenance-watchdog-signal-adapter`
- `npm run check:openclaw-runtime-verification-signal-adapter`
- `npm run check:research-engine-discovery-import`
- `npm run check:host-adapter-boundary`
- `npm run check:directive-workspace-composition`
- `npm run check`

## Rollback path

- move the four adapter files back into `shared/lib/`
- revert the import updates in Discovery, scripts, package exports, and root index
- revert the README changes
- delete this log

## Stop summary

- stopped after moving only the adapter-shaped family out of `shared/lib/`
- did not broaden into another residual-support migration family
- left the remaining `shared/lib/` files in place because they are still cross-cutting support rather than external adapter code
