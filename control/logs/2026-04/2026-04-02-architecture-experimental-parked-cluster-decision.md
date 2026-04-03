# 2026-04-02 - Architecture Experimental Parked Cluster Decision

## Slice

- Owning lane: `Architecture`
- Cluster: `architecture_experimental_parked`
- Result: keep the parked Architecture cluster parked; no single case is the clearly dominant reopen candidate

## Repo truth

- `npm run report:read-only-lifecycle-coordination` shows the top live pressure is still:
  - `architecture_experimental_parked`
  - `caseCount = 10`
  - recommended focus: keep the cluster grouped as parked until new bounded pressure appears
- The ten live parked cases are:
  - `dw-pressure-autoresearch-proof-boundary-2026-03-25`
  - `dw-pressure-daily-qa-quiet-proof-boundary-2026-03-25`
  - `dw-pressure-karpathy-autoresearch-2026-03-25`
  - `dw-pressure-rag-architecture-2026-03-25`
  - `dw-real-gpt-researcher-engine-handoff-2026-03-24`
  - `dw-source-dependency-cruiser-rules-reference-2026-03-30`
  - `dw-source-eslint-custom-rules-2026-03-30`
  - `dw-source-paper2code-2026-03-27`
  - `dw-source-roam-code-2026-03-31`
  - `dw-source-ts-edge-2026-03-27`
- Current case-state truth keeps these cases at `architecture.bounded_result.stay_experimental` with the same legal continuation boundary:
  - explicitly continue the experimental Architecture slice
  - or stop without auto-advancing
- Current stay-experimental reasons remain case-local and unresolved in different ways:
  - several cases still need explicit baggage exclusion and/or executed proof
  - `dw-source-eslint-custom-rules-2026-03-30` is closest to further work, but still has no new active proof demand or dependency making it dominant over the rest
  - `dw-source-dependency-cruiser-rules-reference-2026-03-30` is blocked by direct contradiction with current repo truth
  - `dw-source-roam-code-2026-03-31` closed with a negative spike result that did not justify another bounded slice
  - `dw-source-ts-edge-2026-03-27` did not materialize an Engine code change, proof, or Directive-owned implementation artifact
- No current report, checker, or active implementation target makes one of these ten cases the mandatory next move.

## Decision

- Keep the `architecture_experimental_parked` cluster parked.
- Do not reopen any single case in this run.

## Exact reopen trigger

Reopen one case later only if one specific parked case, and not the cluster generally, gains a fresh bounded reason such as:

- a new active proof or checker dependency that can only be satisfied by continuing that case
- a repo-truth change that invalidates that case's current `stay_experimental_reason`
- a concrete downstream implementation target that names that exact case as required input
- a direct operator or product pressure for that exact retained mechanism that is not shared by the other parked cases

## Why no exact case dominates now

- The cluster pressure is real, but it is aggregation pressure, not a single-case continuation signal.
- The current parked cases are heterogeneous:
  - some are blocked by missing proof
  - some are blocked by unresolved baggage boundaries
  - some already closed negatively
  - some have retained value but no active consumer
- That means reopening one now would be momentum-driven rather than truth-driven.

## Proof path

- `npm run report:read-only-lifecycle-coordination`
- `npm run report:directive-workspace-state`
- `rg -n "architecture_experimental_parked|parked_after_review|stay_experimental|needs-more-evidence|reopen" state control engine discovery runtime`
- `npm run check`

## Rollback

- Remove this log only.

## Stop-line

Stop once the cluster-level keep-parked decision is explicit and checked. Do not reopen any Architecture case, completion frontier, Runtime seam, or host integration seam in this slice.
