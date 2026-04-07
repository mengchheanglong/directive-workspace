# 2026-04-05 structural clarity closeout

## Slice

Bounded repo-closeout clarification pass to make the code-vs-artifact split obvious without moving files.

## Repo truth captured

- `engine/` is the shared kernel.
- `shared/lib/` is the main executable lane and cross-cutting layer, not just generic utilities.
- `shared/lib/architecture-*` is Architecture lane operating code.
- `shared/lib/runtime-*` is Runtime lane operating code.
- `shared/lib/discovery-*` is Discovery lane operating code.
- `shared/lib/dw-state/` is the canonical state resolver surface.
- `architecture/`, `discovery/`, and most of `runtime/` are artifact and proof corpora.
- `runtime/core/` and `runtime/capabilities/` remain the main Runtime executable capability surfaces inside the lane tree.

## Changes

- tightened root and operator navigation docs to explain code-vs-artifact ownership explicitly
- added a local `engine/README.md`
- added local grouped READMEs for:
  - `shared/lib/architecture/`
  - `shared/lib/discovery/`
  - `shared/lib/runtime/`
  - `shared/lib/dw-state/`
- added low-risk barrels for:
  - `shared/lib/runtime/`
  - `shared/lib/dw-state/`

## Reason

The repo was structurally sound, but the folder representation encouraged the wrong mental model:
- lane folders looked like the main home of lane logic
- `shared/lib/` looked like generic utilities

This slice makes the real ownership model visible where people actually navigate the repo.
