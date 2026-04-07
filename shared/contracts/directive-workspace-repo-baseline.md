# Directive Workspace Repo Baseline

## Purpose

Directive Workspace is the product.
Engine is the shared adaptation core inside it.
Discovery, Runtime, and Architecture are the three main operating lanes of the Engine.

This contract defines the stable top-level repo surfaces and the ownership rules that future work must follow so growth stays mission-conditioned, reversible, and measurable.

## Stable Top-Level Surfaces

### Engine Kernel

`engine/` is the canonical product kernel.

It owns shared product behavior such as:
- mission-conditioned usefulness
- source-type normalization
- intake and routing semantics
- decision semantics
- shared adaptation logic
- canonical workspace truth interpretation when that behavior is product-defining

New logic belongs in `engine/` when multiple lanes or product surfaces would otherwise need to recreate the same adaptation behavior.

### Shared Declarative And Support Layer

`shared/` is the Engine-owned declarative and support layer.

Its stable sub-surfaces are:
- `shared/contracts/` for normative behavioral and workflow rules
- `shared/schemas/` for machine-readable shape authority
- `shared/templates/` for canonical record and document templates
- `shared/lib/` for residual reusable support and adapter code that is not the canonical home of lane lifecycle or state logic

New logic belongs in `shared/lib/` only when it is reusable support or adapter code but does not define the product kernel, a lane lifecycle home, or the canonical state surface.
If a module becomes the canonical owner of mission, routing, usefulness, decision, truth semantics, lane lifecycle, or state resolution, it should live in `engine/` instead of remaining support code.

### Lane Surfaces

`discovery/`, `architecture/`, and `runtime/` are lane-owned surfaces.

They are the home for:
- lane operating code under each lane's `lib/` folder
- lane records
- lane-local operational artifacts
- bounded experiment results
- handoff records
- follow-up records
- evaluations and retained results

They are not the default home for new shared product logic, but they are the correct home for lane-local lifecycle code.
Files inside these directories should be treated according to sub-surface:
- `*/lib/` = lane operating code with a clear lane owner
- numbered folders / queue files / routing logs = workflow or corpus artifacts

### Runtime Assets

`runtime/source-packs/` is a runtime assets surface.

It is not:
- a runtime records surface
- a shared product-logic surface
- a general architecture or discovery storage surface

Its contents exist to support runtime usefulness conversion and assetized runtime workflows.
Future work must preserve that distinction even when legacy wording inside the folder is older than the current doctrine.

### Host And Adapter Surfaces

`hosts/` and `frontend/` are host and adapter surfaces.

They may:
- present product behavior
- wrap product behavior
- provide bounded user or operator entrypoints

They must not become the canonical owner of shared Engine semantics.
Host-specific needs should stay host-local unless the behavior is truly product-wide, in which case it belongs in `engine/` or `shared/`.

### Raw Sources

`sources/` is the raw source surface.

It stores source material and intake-adjacent payloads.
It is not the home for downstream product logic, workflow state, or host logic.

### Mirrored State

`state/` is the mirrored operational state surface.

It reflects workflow truth for reporting, parity checking, and bounded automation support.
It does not replace lane records and it does not own workflow semantics independently of the canonical readers and contracts.

### Doctrine, Knowledge, And Entry Scripts

`knowledge/` stores doctrine, planning, and operating knowledge.

`scripts/` stores thin entrypoints, checks, and report wrappers.
Scripts may orchestrate reads, checks, and reporting, but they should not accumulate shared product semantics that belong in `engine/` or reusable support behavior that belongs in `shared/lib/`.

### Historical Corpus

Historical corpus is a cross-cutting classification, not a separate product lane.

Older records, consumed source artifacts, retained evaluations, and archival workflow outputs may remain in place for traceability, but they should not become the default authority for current product structure.
Current truth must come from canonical contracts, shared readers, reports, and checks rather than from folder presence alone.

## Ownership Rules

### When Logic Belongs In `engine/`

Place logic in `engine/` when it:
- defines shared adaptation behavior
- governs usefulness, routing, decision, or workflow interpretation across lanes
- acts as the canonical product owner of a behavior that would otherwise drift across scripts, hosts, or lane-local code

### When Logic Belongs In `shared/lib/`

Place logic in `shared/lib/` when it:
- is reused by multiple product surfaces
- supports checks, reports, record handling, storage compatibility, or shared utilities
- acts as a host-agnostic adapter or integration bridge
- does not itself define the primary product kernel, a lane lifecycle home, or the canonical state surface

If the module becomes the normative owner of product semantics, move that ownership into `engine/`.

### When Something Should Stay Lane-Local

Keep logic or artifacts lane-local only when they are genuinely specific to one lane's workflow and are not intended to become shared product behavior.

Examples include:
- lane-local report assembly
- lane-specific record helpers
- bounded experiment artifacts
- lane-only operational support that has no shared consumer

Do not place logic in a lane directory just because the current case happened there first.
Do place logic in a lane directory when the lane is the durable owner of that lifecycle behavior.

## Growth Rules

### Avoid Notes Sprawl

Do not keep creating new note-family artifacts when repeated pressure is pointing at one missing shared behavior.
When a repeated pattern gains a clear consumer and a bounded target, graduate it into `engine/`, `architecture/lib/`, `runtime/lib/`, `discovery/lib/`, `engine/state/`, `shared/contracts/`, `shared/schemas/`, `shared/templates/`, or `shared/lib/` as appropriate.

### Avoid Host-Specific Drift

Do not let `hosts/` or `frontend/` become alternate homes for product truth.
Adapters may shape presentation and bounded interaction, but the shared behavior must remain Engine-owned.

### Avoid Ad Hoc Top-Level Categories

Do not add a new top-level directory unless it has:
- stable ownership
- a repeated product need
- a clearer boundary than the existing surfaces can provide

Folder creation is not the first answer to ambiguity.
Clarify ownership first, then add a new category only if the existing baseline cannot honestly carry the new surface.

### Keep Lane Corpora Distinct From Product Code

Lane directories may contain explicit lane-local code, but product-wide behavior should not be inferred from corpus volume or historical precedent.
Large record surfaces do not make those surfaces the product kernel.

### Keep Runtime Assets Distinct From Runtime Records

Runtime assets, especially `runtime/source-packs/`, must remain distinguishable from runtime records, runtime proof artifacts, and shared logic.
Asset storage volume is not a signal that runtime assets own shared semantics.

### Keep Truth On Canonical Surfaces

Use canonical contracts, readers, reports, and checks to define live truth.
Do not treat raw folder inspection, historical wording, or isolated records as sufficient authority for current product structure.
