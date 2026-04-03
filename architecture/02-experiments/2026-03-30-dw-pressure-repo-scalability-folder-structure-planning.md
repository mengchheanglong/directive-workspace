# Directive Workspace Repo Scalability And Folder-Structure Planning

## Objective

Define the next safe structural step for Directive Workspace without reopening frozen lanes, changing product semantics, or broadening into a folder-reorganization program.

This planning artifact is bounded to repo topology and folder-surface clarity.

## Current Repo Truth

Current stable structure already clarified by doctrine and baseline contracts:
- `engine/` is the canonical shared product kernel.
- `shared/` is the Engine-owned declarative and support layer.
- `sources/` is the canonical raw-source surface.
- `discovery/`, `architecture/`, and `runtime/` are primarily lane workflow and corpus surfaces.
- `runtime/source-packs/` is a runtime assets surface, not runtime records and not shared product logic.
- `control/` is the active run-control subsystem.

Current volume signals:
- `architecture/` contains `37,026` files.
- `architecture/02-experiments/` contains `36,603` files, or `98.9%` of `architecture/`.
- Hidden virtualenv trees inside `architecture/02-experiments/` contain `36,220` files, or `99.0%` of `02-experiments/`.
- `runtime/` contains `11,212` files, of which `runtime/source-packs/` contains `10,915` (`97.4%`).
- `sources/` contains `12,950` files split across `intake/` and `deferred-or-rejected/`.

## Repo Surface Separation

### Canonical Product Surfaces

- root doctrine and package surfaces: `CLAUDE.md`, `README.md`, `OWNERSHIP.md`, `package.json`, `index.ts`, `STANDALONE_SURFACE.json`
- `knowledge/` for product doctrine and operating knowledge
- `control/` for active run-control guidance, rules, templates, and logs

### Shared Engine Surfaces

- `engine/` for canonical shared product behavior
- `shared/` for contracts, schemas, templates, and reusable support code
- `scripts/` for thin checks, reports, and entrypoints that should not become the owner of product semantics

### Lane Workflow / Corpus Surfaces

- `discovery/` for intake, triage, routing, monitor, and queue-facing workflow artifacts
- `architecture/` for experiments, adopted outputs, implementation records, retained records, and evaluation records
- `runtime/` lane record surfaces such as `follow-up/`, `02-records/`, `03-proof/`, `04-capability-boundaries/`, `05-promotion-readiness/`, `records/`, `promotion-records/`, `registry/`, and runtime run records under `standalone-host/`

### Runtime Asset Surfaces

- `runtime/source-packs/` as the canonical retained runtime asset root

### Historical / Archive Surfaces

- `control/logs/`
- `architecture/99-archive/`
- deferred historical source corpus under `sources/deferred-or-rejected/`
- older lane-local historical records that remain for traceability but are not the primary authority for current product structure

## Structural Pain Points

### 1. `architecture/02-experiments/` is no longer a readable active experiment surface

The dominant friction is not the number of Markdown experiment artifacts.
It is that two hidden local virtualenv directories:
- `architecture/02-experiments/.venv-gptr-smoke`
- `architecture/02-experiments/.venv-mini-swe-slice3`

now account for almost the entire file volume of the active experiment surface.

That causes three problems:
- it makes `architecture/02-experiments/` look like a giant corpus when most of its volume is actually local execution scratch
- it blurs active Architecture workflow artifacts with local tool/runtime state
- it makes future folder-shape reasoning noisier because one lane corpus is being distorted by non-product scratch

No high-authority doctrine or control surfaces reference those `.venv-*` directories as product surfaces.

### 2. `runtime/` remains visually dominated by assets instead of lane records

This is a real readability issue, but it is already partially addressed by the repo-baseline contract and the clarified `runtime/source-packs/README.md`.
The distinction is currently doctrinally clear even though the volume is large.

This is a lower-priority structural friction than the hidden virtualenv issue because `runtime/source-packs/` is a legitimate product surface, not accidental local scratch.

### 3. `sources/` mixes active intake and deferred raw-source history under one canonical source root

This is a real future scaling question, but it is not yet the safest first move.
The split between `intake/` and `deferred-or-rejected/` is already understandable, and changing it now would risk sliding into archive cleanup rather than a bounded structural correction.

## Target Principles

- keep product code, lane corpora, runtime assets, local scratch, and historical logs visibly distinct
- do not let local execution environments live inside lane corpus surfaces
- prefer one small high-signal move over broad folder normalization
- keep legitimate large corpora in place when the boundary is already doctrinally clear
- only move what is clearly non-authoritative and non-product

## Candidate Minimal Restructure Slices

### Candidate A: move lane-local virtualenv scratch out of `architecture/02-experiments/`

Create one explicit non-authoritative scratch surface at the repo root for local transient environments and move:
- `architecture/02-experiments/.venv-gptr-smoke`
- `architecture/02-experiments/.venv-mini-swe-slice3`

into that scratch surface.

Why it is strong:
- fixes the largest current folder-shape distortion immediately
- removes non-product runtime state from an Architecture corpus surface
- does not change product semantics or lane workflow meaning
- is low-risk because the moved directories are local environment trees, not canonical records

Why it is still safe to defer to a follow-up slice:
- it introduces one new top-level scratch category, so it should be done intentionally with one small ownership note instead of as an untracked move

### Candidate B: add one runtime-surface inventory note that distinguishes runtime lane records, runtime assets, and runtime run-output surfaces

Why it is useful:
- would reduce reader confusion inside `runtime/`

Why it is not first:
- it is mostly explanatory because the baseline contract and `runtime/source-packs/README.md` already carry the key distinction

### Candidate C: separate active vs historical raw-source corpora more explicitly under `sources/`

Why it is useful:
- would improve long-term source-root readability

Why it is not first:
- it is closer to archive-policy work and could easily broaden into corpus cleanup

## Recommended First Safe Slice

Open one bounded structural slice next to create a dedicated non-authoritative scratch/workdir surface and relocate the two hidden `.venv-*` directories out of `architecture/02-experiments/`.

That is the strongest next move because:
- it removes the single biggest live topology distortion
- it improves repo readability without changing any product-facing surface
- it preserves the current doctrine that lane directories are primarily workflow/corpus surfaces
- it does not require any Runtime, Discovery, or Architecture semantic redesign

## Migration Risks

- local path assumptions may exist in untracked operator workflows, so the move should be done in one bounded slice with an explicit rollback path
- introducing a scratch root without a minimal ownership note could create a new ambiguous top-level category
- the move should avoid touching any lane records, checks, or canonical read surfaces

## Explicitly Untouched For Now

Do not change in the next slice:
- `runtime/source-packs/` placement
- `sources/` intake vs deferred layout
- `architecture/99-archive/`
- Runtime execution seams
- structural-mapping boundaries
- legacy corpus cleanup
- canonical truth authority in `shared/lib/dw-state.ts` or `scripts/report-directive-workspace-state.ts`

## Planning Verdict

The next safe folder-structure evolution step is not a broad reorganization.
It is one bounded scratch-surface relocation slice for the two hidden virtualenv directories currently distorting `architecture/02-experiments/`.
