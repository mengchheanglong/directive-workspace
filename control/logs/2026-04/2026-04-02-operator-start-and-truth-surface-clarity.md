# 2026-04-02 Operator Start And Truth Surface Clarity

## Why this slice

- operator simplicity was still hurt by scattered guidance across top-level docs and control docs
- the repo needed one short operator entry surface and a clearer authority split between product truth, control truth, persisted state, history, and scratch

## Bounded changes

- added `operator-start.md` as the shortest operator map
- updated `README.md` to point at the new operator start surface
- updated `control/README.md` with explicit truth/history/scratch boundaries
- updated `control/state/README.md` to describe the full control-state surface, including the coordination ledger
- added `state/README.md` to make case/event persistence distinct from control truth and history

## Proof

- this slice changes operator-facing guidance only
- it does not open workflow seams or change product truth
- checks still pass after the documentation/control-surface clarification

## Stop line

- stop after the operator map, truth-surface clarification, and verification
