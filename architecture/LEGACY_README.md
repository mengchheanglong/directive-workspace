# Architecture Lab

Purpose: Discovery-front-door intake + Architecture-track evaluation surface for Directive Workspace.

This lab is not the callable-runtime lane. It is the working surface for:
- Discovery-style first-pass triage and routing
- Architecture-focused deeper analysis and bounded experiments

Current execution mode: GitHub-first (fastest path).  
Valid source expansion: papers, theory writeups, product docs, technical essays, workflow patterns.

## Folder map

- `00-intake`: historical Architecture intake placeholder only. Raw source material now lives under `C:\Users\User\.openclaw\workspace\directive-workspace\sources\intake\`.
- `01-triage`: quick classification notes and initial fit scoring.
- `02-experiments`: bounded experiments and proof scripts.
- `03-adopted`: framework-adopted patterns accepted for integration.
- `04-deferred-or-rejected`: markdown defer/reject outcomes only. Raw deferred source snapshots now live under `C:\Users\User\.openclaw\workspace\directive-workspace\sources\deferred-or-rejected\`.
- `05-reference-patterns`: reusable architecture snippets or decision records.
- `99-archive`: frozen historical material.

## Standard flow

1. Intake candidate from `sources/intake`.
2. Perform first-pass triage in `01-triage` with `INTAKE_CHECKLIST.md`.
3. Route by adoption target:
   - Architecture value -> continue here
   - Forge/runtime value -> record Forge follow-up
   - not actionable -> defer/monitor/reject/reference
4. Run bounded proof in `02-experiments` for promising candidates.
5. Record explicit decision + adoption target.
6. Store architecture-accepted outcomes in `03-adopted`.
7. Store defer/reject outcomes in `04-deferred-or-rejected` and keep raw deferred source snapshots in `sources/deferred-or-rejected`.

## What "adopted" means here

In `architecture-lab`, `adopted` means:
- this source contains a useful pattern worth integrating into Directive Workspace

It does not mean:
- import the source repo directly
- make the repo callable in Mission Control
- promote it into runtime by default

Callable/runtime delivery belongs to Directive Forge + Mission Control follow-through, not this lab by itself.

Routing rule:
- Forge and Architecture are separated by adoption target, not by source type.

Build-order rule:
- Discovery may be built later as a standalone module, but Discovery logic is still the first step of the operating loop and is applied here during Phase 2.

## Naming convention

- Repo folder: `owner__repo`
- Non-repo source note: `source-<slug>.md`
- Triage note: `YYYY-MM-DD-<candidate-slug>.md`
- Experiment note: `YYYY-MM-DD-<candidate-slug>-experiment.md`

## Scope guard

- This lab is for architecture/workflow improvement of Directive Workspace.
- Tool execution packs and callable repo assets historically lived in `agent-lab`, but `agent-lab` is now being retired by extraction into Directive Workspace and host-owned surfaces.
- Personal project code belongs in project repos, not here.
- Reverse-engineer useful value; do not absorb full runtime stacks unless a separate runtime decision explicitly says so.
