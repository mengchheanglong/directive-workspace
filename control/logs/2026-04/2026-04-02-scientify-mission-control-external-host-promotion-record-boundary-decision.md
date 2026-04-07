# 2026-04-02 - Scientify Mission Control External-Host Promotion-Record Boundary Decision

## Slice

- Owning lane: `Runtime`
- Case: `dw-live-scientify-engine-pressure-2026-03-24`
- Result: keep the one-case external-host promotion-record boundary closed for now

## Repo truth

- `dw-live-scientify-engine-pressure-2026-03-24` remains the unique strongest external-host Runtime candidate in the parked Runtime cluster.
- `npm run check:runtime-promotion-assistance` still proves:
  - assistance state: `ready_but_external_host_candidate`
  - missing prerequisites: none
  - no stronger external-host Runtime candidate exists
- Focused Runtime state still proves Runtime-side readiness is sufficient:
  - current stage remains `runtime.promotion_readiness.opened`
  - proposed host remains `mission-control`
  - no promotion record exists
  - no registry entry exists
- The Mission Control-specific guard/check seam is explicit and green:
  - `shared/contracts/scientify-mission-control-external-host-guard.md`
  - `npm run check:directive-scientify-mission-control-external-host-guard`
- The one-case compile-contract artifact, promotion-input package, and review-boundary record are explicit and green:
  - `runtime/00-follow-up/2026-04-02-dw-live-scientify-engine-pressure-mission-control-external-host-compile-contract-01.md`
  - `runtime/00-follow-up/2026-04-02-dw-live-scientify-engine-pressure-mission-control-external-host-promotion-input-package-01.md`
  - `runtime/00-follow-up/2026-04-02-dw-live-scientify-engine-pressure-mission-control-external-host-review-boundary-record-01.md`
- The remaining live blocker is still the shared host-loading contract:
  - `shared/contracts/runtime-to-host.md` does not authorize `mission-control` as a current bounded host-loading target
  - current bounded manual host-loading seams are still repo-native only

## Why the promotion-record boundary stays closed

- A promotion-record boundary is stronger than the current review-only boundary because it starts asserting record-level host-facing promotion truth rather than only review-packet truth.
- The repo still does not have a truthful shared contract basis for Mission Control as a bounded host-loading target.
- Opening a promotion-record boundary now would therefore blur two still-separated claims:
  - one-case external-host review readiness
  - actual host-facing promotion-record readiness
- That would risk implying:
  - Mission Control host loading is now a legal bounded target
  - a later promotion record is mechanically downhill

Current repo truth does not support either claim yet.

## Decision

- Keep the one-case external-host promotion-record boundary closed for `dw-live-scientify-engine-pressure-2026-03-24`.
- Keep the case at the stronger review-only boundary record.
- Do not open a promotion-record boundary in this slice.

## Explicit non-authorizations

This decision does not authorize:

- creation of a promotion record
- creation of a registry entry
- Mission Control host loading
- Mission Control integration rollout
- broad host integration
- runtime execution
- promotion automation
- generalized external-host Runtime support

## Exact reopen trigger

Reopen this boundary only if a separate bounded decision first makes it truthful for shared Runtime-to-host contract doctrine to support one-case Mission Control host-loading review for this case without broadening to general external-host support.

That future decision would need to keep all of the following explicit:

- one-case only
- manual only
- non-executing
- non-integrating
- no registry acceptance
- no generalized external-host framework

## Proof path

- `npm run check:runtime-promotion-assistance`
- `npm run check:directive-scientify-mission-control-external-host-guard`
- `npm run check:directive-scientify-mission-control-external-host-input-package`
- `npm run check:directive-scientify-mission-control-external-host-review-boundary`
- `npm run report:directive-workspace-state -- runtime/05-promotion-readiness/2026-03-24-dw-live-scientify-engine-pressure-2026-03-24-promotion-readiness.md`
- `npm run check`

## Rollback

- Remove this decision artifact only.

## Stop-line

Stop once the keep-closed promotion-record boundary decision is explicit.
Do not create a promotion record, registry entry, Mission Control integration, runtime execution, or automation in this slice.
