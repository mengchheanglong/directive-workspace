# 2026-04-02 - Runtime Promotion-Readiness Scientify External-Host Priority Decision

## Slice

- Owning lane: `Runtime`
- Case: `dw-live-scientify-engine-pressure-2026-03-24`
- Result: this case is the clearly dominant next reopen candidate inside the parked Runtime promotion-readiness cluster, but it remains parked in this run

## Repo truth

- `npm run report:read-only-lifecycle-coordination` shows eight live cases parked at `runtime.promotion_readiness.opened`.
- `npm run check:runtime-promotion-assistance` identifies exactly one case as different from the rest:
  - `dw-live-scientify-engine-pressure-2026-03-24`
  - assistance state: `ready_but_external_host_candidate`
  - recommended action: `keep_parked_external_host_candidate`
- The same report shows why the rest of the cluster does not dominate:
  - six cases are still blocked by `pending_host_selection`
  - one case is blocked by a missing callable boundary
  - zero additional cases are ready for a bounded manual promotion-seam decision
- Focused Runtime state confirms the Scientify pressure case is structurally complete enough to be the leading candidate:
  - current stage: `runtime.promotion_readiness.opened`
  - promotion-readiness blockers:
    - `runtime_implementation_unopened`
    - `host_facing_promotion_unopened`
  - missing artifacts: none
  - promotion specification exists
  - proposed host is explicit: `mission-control`
- The blocking factor is not general Runtime incompleteness. It is the host scope:
  - proposed host: `mission-control`
  - host scope: `external_host`
- Current repo doctrine still keeps host integration, runtime execution, and broader promotion work closed, so this case is not reopened here.

## Decision

- Treat `dw-live-scientify-engine-pressure-2026-03-24` as the highest-priority single reopen candidate inside the parked Runtime promotion-readiness cluster.
- Keep it parked in the current repo state.
- Do not reopen any other Runtime promotion-readiness case in this run.

## Exact reopen trigger

Reopen this case later only if a separate bounded decision explicitly opens external-host Runtime promotion work for `mission-control`, with all of the following still true:

- the scope remains one-case-only
- the work remains non-executing unless explicitly re-authorized later
- host ownership and compile-contract expectations are explicit
- the reopen does not imply broad host integration, runtime execution, or promotion automation

## Why this case dominates the cluster

- It is the only parked Runtime promotion-readiness case already identified as pre-host ready by the checked assistance surface.
- The remaining cluster members still require more basic readiness work:
  - unresolved host selection
  - unresolved callable-boundary readiness
- That makes this Scientify pressure case the strongest next candidate, but not an already-authorized continuation.

## Proof path

- `npm run report:read-only-lifecycle-coordination`
- `npm run check:runtime-promotion-assistance`
- `npm run report:directive-workspace-state -- runtime/05-promotion-readiness/2026-03-24-dw-live-scientify-engine-pressure-2026-03-24-promotion-readiness.md`
- `npm run check`

## Rollback

- Remove this log only.

## Stop-line

Stop once the cluster has one explicit top-priority case and the keep-parked boundary for that case is written down. Do not reopen host integration, runtime execution, or broad promotion work in this slice.
