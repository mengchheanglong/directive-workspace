# Roam-code / Backstage / Temporal Phased Plan

Date: 2026-03-31
Owner: Directive Architecture
Status: active gated plan
Mode: STANDARD

## Purpose

Preserve the confirmed ordering of the three shortlisted systems and prevent cross-system drift before any Roam-code spike begins.

This plan is intentionally sequential:
- Phase A = Roam-code
- Phase B = Backstage
- Phase C = Temporal

Global gating rule:
- Phase B may not begin until Phase A is completed and explicitly closed.
- Phase C may not begin until Phase B is completed and explicitly closed.
- No system may jump the sequence because it is interesting.

## Major Phase A: Roam-code

### Purpose

Open the first bounded investigation against the current local-first knowledge and operator-surface pressure.

### Why This System Belongs First

Roam-code is first because it is the best current first investigation for the earlier structural question.
It can test whether the next useful layer is a Roam-style local-first operating surface before the repo commits to broader catalog or durable execution work.

### Entry Criteria

- this phased plan exists
- Backstage and Temporal are preserved as parked source references
- no Roam-code implementation has started yet
- the next thread is explicitly authorized to begin Phase A / Roam-code Phase 1 only

### Numbered Subphases

1. Discovery capture and source preservation for Roam-code.
2. One bounded local-first spike plan that defines repo-truth comparison criteria, proof path, rollback path, and stop-line.
3. One bounded result and decision closeout with only three allowed outcomes: `adopt`, `park`, or `continue_one_more_bounded_slice`.

### Proof Path

- Discovery-first Roam-code source artifacts exist.
- One bounded Architecture plan/spike artifact exists.
- One bounded result explicitly compares Roam-code against current repo truth and names the decision outcome.

### Rollback Path

- remove the Roam-code-specific planning and result artifacts created by Phase A
- keep this phased plan and the preserved Backstage and Temporal references

### Stop-Line

Stop after the first honest Phase A closeout.
Do not begin Backstage work by momentum.

### Completion Criteria

- Roam-code has a completed and explicitly closed bounded result
- the result states whether Roam-code is adopted, parked, or requires exactly one more bounded slice
- the repo has an explicit written decision on whether Phase B is unlocked or remains parked

### Next Major Phase Gate

Phase B is forbidden until all completion criteria above are satisfied and the Phase A closeout explicitly authorizes moving forward.

## Major Phase B: Backstage

### Purpose

Use the preserved Backstage source only if Phase A proves that the next real gap is entity/control-plane modeling.

### Why This System Belongs Second

Backstage is second because it is the best follow-on only when the unresolved pressure is catalog, ownership, relation, and control-plane modeling.
It is not first because it is broader and heavier than the first Roam-code investigation.

### Entry Criteria

- Phase A is completed and explicitly closed
- the Phase A closeout names entity/control-plane modeling as the next real gap
- the preserved Backstage source remains accurate enough to reopen without losing context

### Numbered Subphases

1. Reopen the preserved Backstage source and refresh repo-truth pressure against the completed Phase A outcome.
2. Define one bounded Backstage-derived entity/control-plane modeling slice with explicit proof path, rollback path, and stop-line.
3. Close the bounded Backstage result with a decision on whether the modeling gap is satisfied, parked, or needs one more bounded slice.

### Proof Path

- the preserved Backstage source note is cited as the Discovery-held reference
- one bounded Architecture modeling artifact exists
- the Phase B result explicitly states whether the entity/control-plane gap is resolved enough to stop or to unlock Phase C

### Rollback Path

- remove only the bounded Backstage-phase artifacts created after Phase B opens
- keep this phased plan and the preserved source notes

### Stop-Line

Stop after the first honest Phase B closeout.
Do not begin Temporal work unless the Backstage result explicitly closes and unlocks it.

### Completion Criteria

- Backstage has one explicit bounded result and decision closeout
- the result states whether the entity/control-plane gap is resolved, parked, or requires exactly one more bounded slice
- the repo has an explicit written decision on whether Phase C is unlocked or remains parked

### Next Major Phase Gate

Phase C is forbidden until all completion criteria above are satisfied and the Phase B closeout explicitly authorizes moving forward.

## Major Phase C: Temporal

### Purpose

Use the preserved Temporal source only if the earlier phases prove that durable execution and resumability are the next real missing layer.

### Why This System Belongs Third

Temporal is third because durable execution is the latest and heaviest of the three shortlisted seams.
It only becomes high-ROI after the earlier local-first and modeling questions have been answered and explicitly closed.

### Entry Criteria

- Phase B is completed and explicitly closed
- the Phase B closeout shows the next remaining pressure is durable execution, resumability, or crash-proof long-running progress
- the preserved Temporal source remains accurate enough to reopen without losing context

### Numbered Subphases

1. Reopen the preserved Temporal source and restate the durable-execution pressure using the completed outputs of Phase A and Phase B.
2. Define one bounded durable-execution evaluation slice with explicit proof path, rollback path, and stop-line.
3. Close the bounded Temporal result with a decision on whether durable execution should be adopted, parked, or continued by exactly one more bounded slice.

### Proof Path

- the preserved Temporal source note is cited as the Discovery-held reference
- one bounded Architecture durable-execution evaluation artifact exists
- the Phase C result explicitly states whether durable execution is the real next seam or should remain parked

### Rollback Path

- remove only the bounded Temporal-phase artifacts created after Phase C opens
- keep this phased plan and the preserved source notes

### Stop-Line

Stop after the first honest Phase C closeout.
Do not broaden into runtime adoption, orchestration migration, or multi-system blending inside the first Temporal slice.

### Completion Criteria

- Temporal has one explicit bounded result and decision closeout
- the result states whether durable execution is adopted, parked, or requires exactly one more bounded slice
- no broader platform adoption starts without separate later authorization

### Next Major Phase Gate

No later major phase is authorized by this plan.
Any work after Phase C requires a newly authorized bounded scope.
