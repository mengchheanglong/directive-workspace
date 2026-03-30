# Directive Workspace Workdirs

This folder is a local scratch/workdir surface for non-authoritative working environments inside the repo.

It is:
- local scratch only
- non-authoritative
- not product code
- not a lane workflow or corpus surface
- not mirrored state

Use it for:
- temporary virtual environments
- local rebuildable workdirs
- other machine-local execution scratch that should not live inside `discovery/`, `architecture/`, `runtime/`, `sources/`, `shared/`, `engine/`, or `state/`

Do not use it for:
- product logic
- shared contracts, schemas, templates, or libraries
- lane records, proofs, evaluations, or source corpora
- host surfaces
- canonical reports or mirrored state

Rule:
- if an artifact is required to understand product truth, it does not belong here
- if it is rebuildable local execution scratch, it should stay here instead of distorting a product surface
