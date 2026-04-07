# 2026-04-06 Pressure case system-integration audit

## Affected layer

- Architecture kept-pressure follow-through audit

## Owning lane

- Architecture lane

## Mission usefulness

Determine whether the six high-ROI `dw-pressure-*` cases that now resolve at `architecture.post_consumption_evaluation.keep` still have real missing product integration seams, or whether they are already materially integrated in live code and should remain explicit stops.

## Cases audited

- `dw-pressure-agentics-reporting-boundary-2026-03-26`
- `dw-pressure-autoresearch-loop-protocol-2026-03-26`
- `dw-pressure-autoresearch-ship-control-boundary-2026-03-26`
- `dw-pressure-genetic-mutation-2026-03-25`
- `dw-pressure-gpt-researcher-evaluator-quality-2026-03-25`
- `dw-pressure-papercoder-2026-03-25`

## Repo truth

All six cases are already materially integrated into live product code. No additional system-integration rollout is justified from the current `keep` boundary.

### Already materially integrated

- `dw-pressure-agentics-reporting-boundary-2026-03-26`
  - evidence path: `architecture/01-experiments/2026-03-26-dw-pressure-agentics-reporting-boundary-2026-03-26-bounded-result.md`
  - live product surfaces:
    - `architecture/lib/architecture-bounded-closeout.ts`
    - `hosts/web-host/server.ts`
    - `frontend/src/app.ts`
  - integration truth:
    - Architecture closeout now records explicit `transformedArtifactsProduced`
    - the host/server layer accepts that field
    - the frontend exposes it in the Architecture closeout form and detail surface

- `dw-pressure-autoresearch-loop-protocol-2026-03-26`
  - evidence path: `architecture/01-experiments/2026-03-26-dw-pressure-autoresearch-loop-protocol-2026-03-26-bounded-result.md`
  - live product surface:
    - `engine/directive-engine.ts`
  - integration truth:
    - Engine analysis/planning now preserves explicit loop-control signals for preconditions, verification, rollback, decision, and results logging

- `dw-pressure-autoresearch-ship-control-boundary-2026-03-26`
  - evidence path: `architecture/01-experiments/2026-03-26-dw-pressure-autoresearch-ship-control-boundary-2026-03-26-bounded-result.md`
  - live product surface:
    - `engine/directive-engine.ts`
  - integration truth:
    - Engine planning now treats bounded shipping-style checklist/dry-run/approval/rollback/logging structure as control/evidence discipline instead of generic Architecture prose

- `dw-pressure-genetic-mutation-2026-03-25`
  - evidence path: `architecture/01-experiments/2026-03-25-dw-pressure-genetic-mutation-2026-03-25-bounded-result.md`
  - live product surfaces:
    - `engine/directive-engine.ts`
    - `architecture/lib/architecture-bounded-closeout.ts`
  - integration truth:
    - Engine now preserves mutation -> evaluation -> selection structural stages
    - Architecture closeout now carries stage-preservation expectations and warnings when explicit stages would otherwise be flattened

- `dw-pressure-gpt-researcher-evaluator-quality-2026-03-25`
  - evidence path: `architecture/01-experiments/2026-03-25-dw-pressure-gpt-researcher-evaluator-quality-2026-03-25-bounded-result.md`
  - live product surface:
    - `architecture/lib/architecture-bounded-closeout.ts`
  - integration truth:
    - evaluator-oriented closeouts now require concrete validation-method naming instead of allowing proof to remain a bare boolean claim

- `dw-pressure-papercoder-2026-03-25`
  - evidence path: `architecture/01-experiments/2026-03-25-dw-pressure-papercoder-2026-03-25-bounded-result.md`
  - live product surfaces:
    - `engine/directive-engine.ts`
    - `frontend/src/app.ts`
  - integration truth:
    - Engine planning now preserves explicit planning -> analysis -> generation structure for ambiguous mixed sources
    - the Architecture assist surface exposes structural stages and stage-preservation guidance to operators

### No bounded remaining rollout slice

- none of the six currently resolve to a missing live-code seam
- all six now resolve at `architecture.post_consumption_evaluation.keep`
- current doctrine treats `keep` as an explicit stop, not as an automatic â€œcontinue rolloutâ€ instruction

## Classification result

- already materially integrated in code: 6
- needs one bounded follow-through: 0
- artifact-complete and should stay stopped: 6

## Proof path

- `architecture/01-experiments/2026-03-26-dw-pressure-agentics-reporting-boundary-2026-03-26-bounded-result.md`
- `architecture/01-experiments/2026-03-26-dw-pressure-autoresearch-loop-protocol-2026-03-26-bounded-result.md`
- `architecture/01-experiments/2026-03-26-dw-pressure-autoresearch-ship-control-boundary-2026-03-26-bounded-result.md`
- `architecture/01-experiments/2026-03-25-dw-pressure-genetic-mutation-2026-03-25-bounded-result.md`
- `architecture/01-experiments/2026-03-25-dw-pressure-gpt-researcher-evaluator-quality-2026-03-25-bounded-result.md`
- `architecture/01-experiments/2026-03-25-dw-pressure-papercoder-2026-03-25-bounded-result.md`
- `engine/directive-engine.ts`
- `architecture/lib/architecture-bounded-closeout.ts`
- `hosts/web-host/server.ts`
- `frontend/src/app.ts`

## Stop summary

- no new bounded product-integration rollout was opened
- the six kept pressure cases are already integrated and should remain explicit stops unless new bounded pressure appears

