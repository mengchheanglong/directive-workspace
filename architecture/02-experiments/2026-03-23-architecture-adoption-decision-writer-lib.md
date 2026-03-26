# Architecture Adoption Decision Writer Lib

- Date: `2026-03-23`
- Track: `architecture`
- Origin: `internally-generated`
- Usefulness level: `meta`
- Runtime threshold check: `yes` - this improves Architecture's Decide-step retention without requiring a runtime surface

## Why this slice exists

Directive Workspace could:
- resolve Architecture adoption decisions
- build canonical machine-readable adoption artifacts
- summarize those artifacts in cycle evaluation

But it still lacked one system behavior:
- adopted Architecture slices had no canonical retained emission path for `*-adoption-decision.json`

That kept the decision corpus dependent on hand-authored JSON backfills.

## Experiment move

Materialize a canonical shared lib:
- `shared/lib/architecture-adoption-decision-writer.ts`

Mirror it in Mission Control:
- `mission-control/src/lib/directive-workspace/architecture-adoption-decision-writer.ts`

Bind it to:
- a host writer entrypoint: `mission-control/scripts/write-directive-architecture-adoption-decision.ts`
- an executable checker: `mission-control/scripts/check-directive-architecture-adoption-decision-writer.ts`

Default behavior:
- derive the output JSON path from the adopted record path in `architecture/03-adopted/`
- write the machine-readable adoption artifact beside the adopted record
- keep explicit override available only when a bounded different path is needed
- accept raw Architecture review input and resolve the review/adoption path before writing the retained decision artifact

## Expected result

Future adopted Architecture slices should be able to retain their machine-readable decision output through one canonical emission path instead of manual JSON authoring, and the same path should be usable directly from live Decide-step inputs.
